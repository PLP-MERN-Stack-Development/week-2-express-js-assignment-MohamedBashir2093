const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const products = require('../data/products');
const authenticate = require('../middleware/auth');
const validateProduct = require('../middleware/validateProduct');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');


// Search by name
router.get('/search', (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return next(new ValidationError('Search query (q) is required'));
    }

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(q.toLowerCase())
    );

    if (filtered.length === 0) {
      return next(new NotFoundError('No products match your search'));
    }

    res.status(200).json(filtered);
  } catch (err) {
    next(err);
  }
});


// Product statistics 
router.get('/stats', (req, res, next) => {
  try {
    const total = products.length;

    const countByCategory = products.reduce((acc, product) => {
      const category = product.category.toLowerCase();
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({ total, countByCategory });
  } catch (err) {
    next(err);
  }
});


// GET all products (with filter + pagination)

router.get('/', (req, res, next) => {
  try {
    let result = [...products]; 

    
    const { category, page, limit } = req.query;

    if (category && typeof category !== 'string') {
      throw new ValidationError('Category must be a string');
    }

    // Validate and parse page and limit
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : result.length;

    if ((page && isNaN(pageNum)) || (limit && isNaN(limitNum))) {
      throw new ValidationError('Page and limit must be valid numbers');
    }

    // Filter by category 
    if (category) {
      result = result.filter(
        p => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Pagination logic
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedResult = result.slice(startIndex, startIndex + limitNum);

    res.status(200).json({
      page: pageNum,
      limit: limitNum,
      total: result.length,
      data: paginatedResult,
    });
  } catch (err) {
    next(err); 
  }
});




// GET product by ID
router.get('/:id', (req, res, next) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (!product) throw new NotFoundError('Product not found');
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST new product
router.post('/', authenticate, validateProduct, (req, res, next) => {
  try {
    const newProduct = { id: uuidv4(), ...req.body };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});

// PUT update product
router.put('/:id', authenticate, validateProduct, (req, res, next) => {
  try {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) throw new NotFoundError('Product not found');
    products[index] = { id: req.params.id, ...req.body };
    res.json(products[index]);
  } catch (err) {
    next(err);
  }
});

// DELETE product
router.delete('/:id', authenticate, (req, res, next) => {
  try {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) throw new NotFoundError('Product not found');
    const deleted = products.splice(index, 1);
    res.json({ message: 'Product deleted', product: deleted[0] });
  } catch (err) {
    next(err);
  }
});





module.exports = router;
