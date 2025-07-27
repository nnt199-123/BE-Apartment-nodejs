const swaggerJSDoc = require('swagger-jsdoc');
const port=  process.env.DB_PORT
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API BE-Apartment',
      version: '1.0.0',
      description: 'Tài liệu API cho hệ thống quản lý căn hộ',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    servers: [
      {
        url: `http://localhost:${port}/api/v1`,
      },
    ],
  },
  apis: ['./routes/**/*.js'], // 👈 Quét tất cả file JS trong routes, bao gồm tables/**
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
