const express = require ('express');
const bodyParser = require('body-parser');
const {v4: uuidv4} = require('uuid');
require('dotenv').config();



const app = express();

const PORT = process.env.PORT || 3000;






let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];


class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
  }
}


// logger

const logger = (req, res, next) =>{
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
}


const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== 'mohamedbashir123') {
    return res.status(401).json({ error: 'Unauthorized. Missing or invalid API key' });
  }

  next();
};


const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;

  if (
    typeof name !== 'string' ||
    typeof description !== 'string' ||
    typeof price !== 'number' ||
    typeof category !== 'string' ||
    typeof inStock !== 'boolean'
  ) {
    return res.status(400).json({ error: 'Invalid product data. Please check field types.' });
  }

  next();
};



// middleware
app.use(bodyParser.json())
app.use(logger);


app.get('/', (req, res) => {
    res.send('hello world! hirab')
})



app.get('/api/products', (req, res, next) => {
  try {
    let result = [...products]; // Copy original

    // Filter by category
    if (req.query.category) {
      result = result.filter(p => p.category.toLowerCase() === req.query.category.toLowerCase());
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || result.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedResult = result.slice(startIndex, endIndex);

    res.json({
      page,
      limit,
      total: result.length,
      data: paginatedResult
    });
  } catch (err) {
    next(err);
  }
});



// Search by Name

app.get('/api/products/search', (req, res, next) => {
  try {
    const query = req.query.q?.toLowerCase();

    if (!query) {
      throw new NotFoundError('Query parameter "q" is missing');
    }

    const matched = products.filter(p =>
      p.name.toLowerCase().includes(query)
    );

    if (matched.length === 0) {
      throw new NotFoundError('Product not found');
    }
    
    console.log("Query:", query);
console.log("All product names:", products.map(p => p.name));

    res.json({ total: matched.length, results: matched });
  } catch (err) {
    next(err);
  }
});

//Product Statistics
app.get('/api/products/stats', (req, res, next) => {
  try {
    const stats = {};

    products.forEach(p => {
      const category = p.category.toLowerCase();
      stats[category] = (stats[category] || 0) + 1;
    });

    res.json({
      total: products.length,
      countByCategory: stats
    });
  } catch (err) {
    next(err);
  }
});







app.get('/api/products/:id', (req, res, next) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (!product) throw new NotFoundError('Product not found');
    res.json(product);
  } catch (err) {
    next(err);
  }
});




app.post('/api/products', authenticate, validateProduct, (req, res, next) => {
  try {
    const { name, description, price, category, inStock } = req.body;
    const newProduct = {
      id: uuidv4(),
      name,
      description,
      price,
      category,
      inStock
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});





app.put('/api/products/:id', authenticate, validateProduct, (req, res, next) => {
  try {
    const productId = req.params.id;
    const { name, description, price, category, inStock } = req.body;
    const index = products.findIndex(p => p.id === productId);

    if (index === -1) throw new NotFoundError('Product not found');

    products[index] = {
      id: productId,
      name,
      description,
      price,
      category,
      inStock
    };

    res.json(products[index]);
  } catch (err) {
    next(err);
  }
});



app.delete('/api/products/:id', authenticate, (req, res, next) => {
  try {
    const productId = req.params.id;
    const index = products.findIndex(p => p.id === productId);

    if (index === -1) throw new NotFoundError('Product not found');

    const deleted = products.splice(index, 1);
    res.json({ message: 'Product deleted', product: deleted[0] });
  } catch (err) {
    next(err);
  }
});







//global error handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
});








app.listen(PORT, () =>{
    console.log(`server is running at http://localhost:${PORT}`)
})