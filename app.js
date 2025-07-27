var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors'); // thiếu require nếu chưa có

// 🔥 Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/database/swagger');

// ✅ Database
const { connectToDatabase } = require('./config/database/postgresql');
connectToDatabase()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Database connection error:', err));

var indexRouter = require('./routes/index');

var app = express(); // ✅ Phải tạo trước khi gọi app.use

app.use(cors({
  origin: 'http://localhost:3000', // 👈 URL frontend của em
  credentials: true,               // 👈 Cho phép gửi cookie
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ Your APIs
app.use('/api', indexRouter);

module.exports = app;
