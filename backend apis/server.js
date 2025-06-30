const express = require("express");
const connection = require("./src/config/db");
const app = express();
const productRouter = require('./src/routes/Router');
require('dotenv').config();

const port = 5000;

app.get('/', (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      message: "",
      data: [
        { id: 1, name: "Product A", price: 100 },
        { id: 2, name: "Product B", price: 150 },
      ],
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
      data: [],
    });
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded files
app.use('/uploads', express.static('src/uploads'));

// ✅ Routes
app.use('/products', productRouter);

// ✅ Connect to DB
connection();

// ✅ Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
