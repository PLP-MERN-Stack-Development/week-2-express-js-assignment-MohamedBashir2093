const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const logger = require('./middleware/logger');
const productsRoutes = require('./routes/products');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(logger);

app.use('/api/products', productsRoutes);

// Root Hello World
app.get('/', (req, res) => res.send("Hello World"));


// Global error handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error'});
});




app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
