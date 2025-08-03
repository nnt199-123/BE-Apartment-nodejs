var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/database/swagger');

const { connectToDatabase, promptUserForTableAction } = require('./config/database/postgresql');
var indexRouter = require('./routes/index');

var app = express();

(async () => {
  const connected = await connectToDatabase();
  if (!connected) {
    console.error('❌ Không thể kết nối DB. Dừng app.');
    process.exit(1);
  }

  await promptUserForTableAction();

  // Middleware
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }));
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  // Swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Router
  app.use('/api', indexRouter);
})();

module.exports = app;
