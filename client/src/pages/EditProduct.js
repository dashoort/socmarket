import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProduct, updateProduct } from '../store/slices/productSlice';
import { FaUpload, FaTimes, FaSave } from 'react-icons/fa';
import './ProductForm.css';

const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProduct, loading, error } = useSelector((state) => state.products);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    imageUrl: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const categories = [
    'Smartphones', 'Laptops', 'Tablets', 'Gaming Consoles', 
    'Audio Equipment', 'Cameras', 'Smart Home', 'Other'
  ];

  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Used'];

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentProduct) {
      setFormData({
        title: currentProduct.title || '',
        description: currentProduct.description || '',
        price: currentProduct.price?.toString() || '',
        category: currentProduct.category || '',
        condition: currentProduct.condition || '',
        imageUrl: currentProduct.image_url || ''
      });
      setImagePreview(currentProduct.image_url || null);
    }
  }, [currentProduct]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Max size 5MB'); return; }
    if (!file.type.startsWith('image/')) { alert('Select an image'); return; }
    setImage(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const payload = {
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      condition: formData.condition,
      imageUrl: formData.imageUrl,
      image
    };
    const result = await dispatch(updateProduct({ id, productData: payload }));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate(`/products/${id}`);
    }
  };

  return (
    <div className="product-form-page">
      <div className="container">
        <div className="form-container">
          <h1 className="form-title">Edit Listing</h1>
          <p className="form-subtitle">Update your product details</p>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Product Title *</label>
                <input type="text" name="title" className={`form-input ${errors.title ? 'error' : ''}`} value={formData.title} onChange={handleChange} />
                {errors.title && <span className="form-error">{errors.title}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Price (in ₹) *</label>
                <div className="price-input">
                  <span className="currency">₹</span>
                  <input type="number" name="price" className={`form-input ${errors.price ? 'error' : ''}`} value={formData.price} onChange={handleChange} min="0" step="1" />
                </div>
                {errors.price && <span className="form-error">{errors.price}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select name="category" className={`form-input form-select ${errors.category ? 'error' : ''}`} value={formData.category} onChange={handleChange}>
                  <option value="">Select a category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <span className="form-error">{errors.category}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Condition *</label>
                <select name="condition" className={`form-input form-select ${errors.condition ? 'error' : ''}`} value={formData.condition} onChange={handleChange}>
                  <option value="">Select condition</option>
                  {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.condition && <span className="form-error">{errors.condition}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea name="description" className={`form-input form-textarea ${errors.description ? 'error' : ''}`} rows={6} value={formData.description} onChange={handleChange} />
              {errors.description && <span className="form-error">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Product Image</label>
              <div className="image-upload-container">
                {imagePreview ? (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                    <button type="button" className="remove-image-btn" onClick={removeImage}><FaTimes /></button>
                  </div>
                ) : (
                  <div className="image-upload-area">
                    <input type="file" accept="image/*" onChange={handleImageChange} id="image-upload" className="image-input" />
                    <label htmlFor="image-upload" className="upload-label">
                      <FaUpload className="upload-icon" />
                      <span>Click to upload image</span>
                      <small>Max size: 5MB</small>
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (<><div className="loading-spinner"></div>Saving...</>) : (<><FaSave /> Save Changes</>)}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
