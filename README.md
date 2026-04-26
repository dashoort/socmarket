# Electronics Marketplace Platform

A full-stack online marketplace for buying and selling used electronics, built with React, Redux, Node.js, Express, and SQLite. Features real-time chat, user authentication, and comprehensive product management.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization**
  - Secure user registration and login
  - Bcrypt-based password encryption
  - Session-based authentication
  - Protected routes and middleware

- **Product Management**
  - Create, read, update, and delete product listings
  - Image upload support with file validation
  - Advanced filtering and search capabilities
  - Category and condition-based organization

- **Real-time Chat System**
  - WebSocket-based messaging
  - Direct communication between buyers and sellers
  - Conversation management
  - Real-time message delivery

- **Modern UI/UX**
  - Responsive design for all devices
  - Beautiful gradient backgrounds and animations
  - Card-based product display
  - Interactive filters and search

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **React Icons** - Icon library
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite3** - Database
- **WebSocket (ws)** - Real-time communication
- **Multer** - File upload handling
- **Bcryptjs** - Password hashing
- **Express Session** - Session management

### Security & Performance
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection
- **Input Validation** - Data sanitization

## 📁 Project Structure

```
electronics-marketplace/
├── server/                 # Backend server
│   ├── index.js           # Main server file
│   └── uploads/           # Image uploads directory
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store and slices
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── public/            # Static assets
├── package.json            # Server dependencies
├── client/package.json     # Client dependencies
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd electronics-marketplace
   ```

2. **Install server dependencies**
   ```bash
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Start the development servers**
   ```bash
   # Start both server and client (recommended)
   npm run dev
   
   # Or start them separately:
   npm run server    # Backend on port 5000
   npm run client    # Frontend on port 3000
   ```

### Environment Setup

The application will create necessary directories and database files automatically. No additional configuration is required for development.

## 📱 Usage

### For Buyers
1. **Browse Products**: View all available electronics with filters
2. **Search & Filter**: Use category, condition, and price filters
3. **View Details**: Click on products to see full information
4. **Contact Seller**: Use the chat system to message sellers

### For Sellers
1. **Create Account**: Register and verify your account
2. **List Products**: Add new electronics with images and descriptions
3. **Manage Listings**: Edit or remove your products
4. **Respond to Messages**: Chat with potential buyers

### Chat System
- **Real-time Messaging**: Instant message delivery
- **Conversation Management**: Organize chats by user
- **File Sharing**: Send images in conversations
- **Online Status**: See when users are active

## 🔧 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user

### Products
- `GET /api/products` - List all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/user/products` - Get user's products

### Chat
- `GET /api/conversations` - Get user conversations
- `GET /api/messages/:userId` - Get messages with user

## 🎨 UI Components

### Design System
- **Color Palette**: Modern gradients and consistent colors
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent margins and padding using utility classes
- **Animations**: Smooth transitions and hover effects

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: Tablet and desktop adaptations
- **Touch Friendly**: Proper touch targets and interactions

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **Session Management**: Secure session handling
- **Input Validation**: Server-side data validation
- **Rate Limiting**: API abuse prevention
- **CORS Protection**: Cross-origin request handling
- **Security Headers**: Helmet.js protection

## 🚀 Deployment

### Production Build
```bash
# Build the client
cd client
npm run build

# Start production server
npm start
```

### Environment Variables
For production, consider setting:
- `NODE_ENV=production`
- `PORT` (if different from 5000)
- `SESSION_SECRET` (strong secret key)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure both server and client are running
4. Check database file permissions

## 🔮 Future Enhancements

- **Payment Integration**: Stripe/PayPal support
- **Email Notifications**: Transaction and message alerts
- **Advanced Search**: Elasticsearch integration
- **Mobile App**: React Native version
- **Admin Panel**: User and product moderation
- **Analytics**: Sales and user behavior tracking

---

Built with ❤️ using modern web technologies 