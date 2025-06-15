
# 🛒 Product API

A RESTful API built with Express.js to manage products, with features like filtering, search, statistics, authentication, validation, and error handling.

## 📦 Features

- Basic CRUD operations for products
- Middleware for logging, authentication, and validation
- Custom error handling with appropriate HTTP status codes
- Support for filtering, pagination, and searching
- Product statistics by category
- API key-based protection for POST, PUT, and DELETE routes

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation


git clone https://github.com/PLP-MERN-Stack-Development/week-2-express-js-assignment-MohamedBashir2093.git   
cd week-2-express-js-assignment-MohamedBashir2093
npm install


### Environment Variables

Create a `.env` file at the root of the project:


PORT=3000
API_KEY=your_api_key_here




### Start the Server

node server.js


Server runs at: `http://localhost:3000`

## 🛠️ API Endpoints

All routes are prefixed with `/api/products`

| Method | Route                         | Description               | Protected |
| ------ | ----------------------------- | ------------------------- | --------- |
| GET    | `/`                           | Hello World message       | ❌         |
| GET    | `/api/products`               | List all products         | ❌         |
| GET    | `/api/products/:id`           | Get product by ID         | ❌         |
| POST   | `/api/products`               | Create a new product      | ✅         |
| PUT    | `/api/products/:id`           | Update product            | ✅         |
| DELETE | `/api/products/:id`           | Delete product            | ✅         |
| GET    | `/api/products/search?q=term` | Search by product name    | ❌         |
| GET    | `/api/products/stats`         | Product count by category | ❌         |

> ✅ Requires `x-api-key` header (value: `your_api_key_here` by default) 

## 🧪 Example JSON for POST/PUT

  json
{
  "name": "Tablet",
  "description": "Android tablet 10 inch",
  "price": 199.99,
  "category": "electronics",
  "inStock": true
}


## 📁 Project Structure


.
├── data/
│   └── products.js
├── errors/
│   ├── NotFoundError.js
│   └── ValidationError.js
├── middleware/
│   ├── auth.js
│   ├── logger.js
│   └── validateProduct.js
├── routes/
│   └── products.js
├── .env
├── .gitignore
├── server.js
└── README.md

 ## ✅ Status Codes Used

| Code | Meaning               |
| ---- | --------------------- |
| 200  | OK                    |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 404  | Not Found             |
| 500  | Internal Server Error |




## 📄 License

MIT


