const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// create product
router.post('/', auth, async (req, res) => {
  try {
    const { name, price, description, createdBy } = req.body;
    let ownerId = req.user._id;

    
    if (req.user.role === 'admin' && createdBy) ownerId = createdBy;

 
    if (req.user.role !== 'admin' && createdBy && createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Users cannot create products for others' });
    }

    const product = await Product.create({
      name,
      price,
      description,
      createdBy: ownerId
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('POST /products error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// list products
router.get('/', auth, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { createdBy: req.user._id };
    const items = await Product.find(query).populate('createdBy', 'name email role');
    res.json(items);
  } catch (err) {
    console.error('GET /products error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Only admin or owner can update
    if (req.user.role !== 'admin' && product.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    product.name = req.body.name ?? product.name;
    product.price = req.body.price ?? product.price;
    product.description = req.body.description ?? product.description;

    await product.save();
    res.json(product);
  } catch (err) {
    console.error('PUT /products/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (req.user.role !== 'admin' && product.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await Product.deleteOne({ _id: id }); // safer than remove()
    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error('DELETE /products/:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
