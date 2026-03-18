const swaggerJSDoc = require('swagger-jsdoc');
const isProd = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;

// Force HTTPS in production
const baseUrl = isProd
  ? process.env.APP_HOST // must be HTTPS in production
  : `http://localhost:${port}`;

console.log(`🚀 Running in ${process.env.NODE_ENV || 'development'} mode`);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ONLINE STORE API',
      version: '1.0.0',
      description: 'Your one-stop shop for books and stationery essentials. Easy ordering, secure payments, and quick delivery. Designed to make shopping simple and enjoyable.',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: baseUrl,
        description: `${process.env.NODE_ENV || 'development'} server`
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      tags: [],
      schemas: {
       
      }
    }
  },
  // Only scan route files (safer)
  apis: [
    './src/modules/**/*.routes.js',
    './src/routes.js'
  ]
};
const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;