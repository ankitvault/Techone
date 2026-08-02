const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, imageUrl: bodyImageUrl } = req.body;
    let imageUrl = bodyImageUrl || '';

    if (req.file) {
      const apiKey = process.env.CLOUDINARY_API_KEY;
      if (!apiKey || apiKey === 'your_api_key' || apiKey.includes('your_')) {
        return res.status(400).json({
          message: 'Cloudinary API Key is not configured on your server environment (Render). Please set valid CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in Render Environment Variables, or provide a direct Image URL.'
        });
      }
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    if (!imageUrl) {
      return res.status(400).json({ message: 'Please upload an image file or provide a direct Image URL.' });
    }

    const product = new Product({
      name, description, price, category, stock, imageUrl
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, imageUrl: bodyImageUrl } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;
      product.stock = stock || product.stock;

      if (bodyImageUrl) {
        product.imageUrl = bodyImageUrl;
      }

      if (req.file) {
        const apiKey = process.env.CLOUDINARY_API_KEY;
        if (!apiKey || apiKey === 'your_api_key' || apiKey.includes('your_')) {
          return res.status(400).json({
            message: 'Cloudinary API Key is not configured on your server environment (Render). Please set valid Cloudinary API keys or provide a direct Image URL.'
          });
        }
        const result = await cloudinary.uploader.upload(req.file.path);
        product.imageUrl = result.secure_url;
      }
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
