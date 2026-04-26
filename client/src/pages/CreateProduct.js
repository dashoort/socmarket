import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../store/slices/productSlice';
import { FaUpload, FaTimes, FaSave } from 'react-icons/fa';
import './ProductForm.css';

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.products);

  const categories = [
    'Smartphones', 'Laptops', 'Tablets', 'Gaming Consoles', 
    'Audio Equipment', 'Cameras', 'Smart Home', 'Other'
  ];

  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Used'];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.condition) {
      newErrors.condition = 'Condition is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      image: image
    };

    const result = await dispatch(createProduct(productData));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/my-products');
    }
  };

  return (
    <div className="product-form-page">
      <div className="container">
        <div className="form-container">
          <h1 className="form-title">List Your Electronics</h1>
          <p className="form-subtitle">Create a new listing to start selling</p>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Product Title *</label>
                <input
                  type="text"
                  name="title"
                  className={`form-input ${errors.title ? 'error' : ''}`}
                  placeholder="e.g., iPhone 13 Pro Max"
                  value={formData.title}
                  onChange={handleChange}
                  maxLength={100}
                />
                {errors.title && <span className="form-error">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Price (in ₹) *</label>
                <div className="price-input">
                  <span className="currency">₹</span>
                  <input
                    type="number"
                    name="price"
                    className={`form-input ${errors.price ? 'error' : ''}`}
                    placeholder="0"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="1"
                  />
                </div>
                {errors.price && <span className="form-error">{errors.price}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  className={`form-input form-select ${errors.category ? 'error' : ''}`}
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <span className="form-error">{errors.category}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Condition *</label>
                <select
                  name="condition"
                  className={`form-input form-select ${errors.condition ? 'error' : ''}`}
                  value={formData.condition}
                  onChange={handleChange}
                >
                  <option value="">Select condition</option>
                  {conditions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
                {errors.condition && <span className="form-error">{errors.condition}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                className={`form-input form-textarea ${errors.description ? 'error' : ''}`}
                placeholder="Describe your product in detail..."
                value={formData.description}
                onChange={handleChange}
                rows={6}
                maxLength={1000}
              />
              <div className="character-count">
                {formData.description.length}/1000 characters
              </div>
              {errors.description && <span className="form-error">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Product Image</label>
              <div className="image-upload-container">
                {imagePreview ? (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={removeImage}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <div className="image-upload-area">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      id="image-upload"
                      className="image-input"
                    />
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
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/my-products')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Create Listing
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;