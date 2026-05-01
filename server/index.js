const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const WebSocket = require('ws');
const http = require('http');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// СТАЛО:
const isProduction = process.env.NODE_ENV === 'production';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const WS_URL = process.env.WS_URL || 'ws://localhost:5000';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", WS_URL, CLIENT_URL],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
    },
  },
}));

app.use(cors({
  origin: isProduction ? CLIENT_URL : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.static('uploads'));

app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(session({
  secret: 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Database setup
const db = new sqlite3.Database('marketplace.db');

// Create tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Products table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    condition TEXT NOT NULL,
    image_url TEXT,
    seller_id INTEGER NOT NULL,
    status TEXT DEFAULT 'available',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users (id)
  )`);

  // Messages table
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    product_id INTEGER,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users (id),
    FOREIGN KEY (receiver_id) REFERENCES users (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
  )`);

  // Таблица "Мои желания" (wishlist)
  db.run(`CREATE TABLE IF NOT EXISTS wishlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    listing_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (listing_id) REFERENCES products(id),
    UNIQUE(user_id, listing_id)
  )`);

// Таблица "Витрина покупок" (purchases)
  db.run(`CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    listing_id INTEGER NOT NULL,
    is_public INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (listing_id) REFERENCES products(id)
  )`);
});

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// WebSocket connection handling
const clients = new Map();

wss.on('connection', (ws, req) => {
  const userId = req.url.split('=')[1];
  if (userId) {
    clients.set(userId, ws);
  }

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      const { receiverId, message: msg, productId } = data;

      // Save message to database
      db.run(
        'INSERT INTO messages (sender_id, receiver_id, product_id, message) VALUES (?, ?, ?, ?)',
        [userId, receiverId, productId, msg],
        function(err) {
          if (!err) {
            // Send message to receiver if online
            const receiverWs = clients.get(receiverId.toString());
            if (receiverWs) {
              receiverWs.send(JSON.stringify({
                type: 'message',
                senderId: userId,
                message: msg,
                productId: productId,
                timestamp: new Date().toISOString()
              }));
            }
          }
        }
      );
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    // Remove client from map
    for (const [key, value] of clients.entries()) {
      if (value === ws) {
        clients.delete(key);
        break;
      }
    }
  });
});

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
};

// Routes

// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            res.status(400).json({ error: 'Username or email already exists' });
          } else {
            res.status(500).json({ error: 'Registration failed' });
          }
        } else {
          res.json({ message: 'User registered successfully', userId: this.lastID });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) {
      res.status(500).json({ error: 'Login failed' });
    } else if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
    } else {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (isValidPassword) {
        req.session.userId = user.id;
        res.json({
          message: 'Login successful',
          user: { id: user.id, username: user.username, email: user.email }
        });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    }
  });
});

// User logout
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logout successful' });
});

// Get current user
app.get('/api/user', requireAuth, (req, res) => {
  db.get('SELECT id, username, email FROM users WHERE id = ?', [req.session.userId], (err, user) => {
    if (err) {
      res.status(500).json({ error: 'Failed to get user' });
    } else {
      res.json(user);
    }
  });
});

// Create product listing
app.post('/api/products', requireAuth, upload.single('image'), (req, res) => {
  const { title, description, price, category, condition } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  db.run(
    'INSERT INTO products (title, description, price, category, condition, image_url, seller_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title, description, price, category, condition, imageUrl, req.session.userId],
    function(err) {
      if (err) {
        res.status(500).json({ error: 'Failed to create product' });
      } else {
        res.json({ message: 'Product created successfully', productId: this.lastID });
      }
    }
  );
});

// Get all products with filters
app.get('/api/products', (req, res) => {
  const { category, condition, minPrice, maxPrice, search } = req.query;
  let query = 'SELECT p.*, u.username as seller_name FROM products p JOIN users u ON p.seller_id = u.id WHERE p.status = "available"';
  const params = [];

  if (category) {
    query += ' AND p.category = ?';
    params.push(category);
  }
  if (condition) {
    query += ' AND p.condition = ?';
    params.push(condition);
  }
  if (minPrice) {
    query += ' AND p.price >= ?';
    params.push(minPrice);
  }
  if (maxPrice) {
    query += ' AND p.price <= ?';
    params.push(maxPrice);
  }
  if (search) {
    query += ' AND (p.title LIKE ? OR p.description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY p.created_at DESC';

  db.all(query, params, (err, products) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch products' });
    } else {
      res.json(products);
    }
  });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  db.get(
    'SELECT p.*, u.username as seller_name FROM products p JOIN users u ON p.seller_id = u.id WHERE p.id = ?',
    [req.params.id],
    (err, product) => {
      if (err) {
        res.status(500).json({ error: 'Failed to fetch product' });
      } else if (!product) {
        res.status(404).json({ error: 'Product not found' });
      } else {
        res.json(product);
      }
    }
  );
});

// Update product
app.put('/api/products/:id', requireAuth, upload.single('image'), (req, res) => {
  const { title, description, price, category, condition } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;

  db.run(
    'UPDATE products SET title = ?, description = ?, price = ?, category = ?, condition = ?, image_url = ? WHERE id = ? AND seller_id = ?',
    [title, description, price, category, condition, imageUrl, req.params.id, req.session.userId],
    function(err) {
      if (err) {
        res.status(500).json({ error: 'Failed to update product' });
      } else if (this.changes === 0) {
        res.status(403).json({ error: 'Not authorized to update this product' });
      } else {
        res.json({ message: 'Product updated successfully' });
      }
    }
  );
});

// Delete product
app.delete('/api/products/:id', requireAuth, (req, res) => {
  db.run(
    'DELETE FROM products WHERE id = ? AND seller_id = ?',
    [req.params.id, req.session.userId],
    function(err) {
      if (err) {
        res.status(500).json({ error: 'Failed to delete product' });
      } else if (this.changes === 0) {
        res.status(403).json({ error: 'Not authorized to delete this product' });
      } else {
        res.json({ message: 'Product deleted successfully' });
      }
    }
  );
});

// Get user's products
app.get('/api/user/products', requireAuth, (req, res) => {
  db.all('SELECT * FROM products WHERE seller_id = ? ORDER BY created_at DESC', [req.session.userId], (err, products) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch products' });
    } else {
      res.json(products);
    }
  });
});

// Get chat messages
app.get('/api/messages/:userId', requireAuth, (req, res) => {
  const { userId } = req.params;
  db.all(
    'SELECT m.*, u.username as sender_name FROM messages m JOIN users u ON m.sender_id = u.id WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?) ORDER BY m.created_at ASC',
    [req.session.userId, userId, userId, req.session.userId],
    (err, messages) => {
      if (err) {
        res.status(500).json({ error: 'Failed to fetch messages' });
      } else {
        res.json(messages);
      }
    }
  );
});

// Get chat conversations
app.get('/api/conversations', requireAuth, (req, res) => {
  db.all(
    `SELECT DISTINCT 
      CASE 
        WHEN m.sender_id = ? THEN m.receiver_id 
        ELSE m.sender_id 
      END as other_user_id,
      u.username as other_username,
      MAX(m.created_at) as last_message_time
    FROM messages m 
    JOIN users u ON (
      CASE 
        WHEN m.sender_id = ? THEN m.receiver_id 
        ELSE m.sender_id 
      END = u.id
    )
    WHERE m.sender_id = ? OR m.receiver_id = ?
    GROUP BY other_user_id
    ORDER BY last_message_time DESC`,
    [req.session.userId, req.session.userId, req.session.userId, req.session.userId],
    (err, conversations) => {
      if (err) {
        res.status(500).json({ error: 'Failed to fetch conversations' });
      } else {
        res.json(conversations);
      }
    }
  );
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const wishlistRoutes = require('./routes/wishlist');
const purchaseRoutes = require('./routes/purchases');
const userRoutes = require('./routes/users');

app.use('/api/wishlist', wishlistRoutes(db));
app.use('/api/purchases', purchaseRoutes(db));
app.use('/api/users', userRoutes(db));

// Все остальные запросы отдаём React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});