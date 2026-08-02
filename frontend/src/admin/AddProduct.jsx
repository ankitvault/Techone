import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: '', stock: '', imageUrl: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image && !formData.imageUrl) {
      return alert('Please upload an image file OR provide a direct Image URL.');
    }
    
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('stock', formData.stock);
    if (formData.imageUrl) data.append('imageUrl', formData.imageUrl);
    if (image) data.append('image', image);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` },
        body: data
      });
      const responseData = await res.json();
      
      if (res.ok) {
        alert('Product created successfully!');
        navigate('/shop');
      } else {
        alert(responseData.message || 'Error creating product');
      }
    } catch (error) {
      console.error(error);
      alert('Error creating product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', background: 'var(--card-bg)', padding: '40px', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
      <h2 style={{ color: '#f97316', marginBottom: '20px' }}>Add New Product</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" placeholder="Product Name" required 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
          style={inputStyle} 
        />
        <textarea 
          placeholder="Description" required rows="4"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})} 
          style={inputStyle} 
        />
        <input 
          type="number" placeholder="Price" required step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})} 
          style={inputStyle} 
        />
        <input 
          type="text" placeholder="Category" required 
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})} 
          style={inputStyle} 
        />
        <input 
          type="number" placeholder="Stock Quantity" required 
          value={formData.stock}
          onChange={(e) => setFormData({...formData, stock: e.target.value})} 
          style={inputStyle} 
        />
        
        <div style={{ padding: '15px', border: '1px dashed #f97316', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ display: 'block', color: 'var(--text-muted)' }}>Product Image (Choose File OR Paste Image URL)</label>
          <input 
            type="file" accept="image/*" 
            onChange={(e) => setImage(e.target.files[0])} 
            style={{ color: 'var(--text-color)' }}
          />
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 'bold' }}>— OR —</div>
          <input 
            type="url" placeholder="Direct Image URL (e.g. Cloudinary, Unsplash link)" 
            value={formData.imageUrl} 
            onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} 
            style={inputStyle} 
          />
        </div>

        <button type="submit" disabled={loading} className="btn" style={{ marginTop: '10px' }}>
          {loading ? 'Publishing Product...' : 'Publish Product'}
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  padding: '12px',
  background: 'var(--input-bg)',
  border: '1px solid var(--input-border)',
  borderRadius: '6px',
  color: 'var(--input-text)',
  fontSize: '15px',
  outline: 'none'
};

export default AddProduct;
