// ... các dòng require có sẵn
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// 🔥 Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/database/swagger'); // đường dẫn đến file config bạn vừa tạo

// ✅ Database
const { connectToDatabase } = require('./config/database/postgresql');
connectToDatabase()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Database connection error:', err));

var indexRouter = require('./routes/index');

var app = express();
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
