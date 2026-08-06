const path = require("path");
const fs = require("fs");
const swaggerJsdoc = require("swagger-jsdoc");

const loadSchemas = () => {
  const schemasDir = path.join(__dirname, "schemas");
  let schemas = {};

  if (fs.existsSync(schemasDir)) {
    fs.readdirSync(schemasDir).forEach((file) => {
      if (file.endsWith(".js")) {
        const schemaModule = require(path.join(schemasDir, file));
        schemas = { ...schemas, ...schemaModule };
      }
    });
  }

  return schemas;
};

const loadPaths = () => {
  const pathsDir = path.join(__dirname, "paths");
  let paths = {};

  if (fs.existsSync(pathsDir)) {
    fs.readdirSync(pathsDir).forEach((file) => {
      if (file.endsWith(".js")) {
        const pathModule = require(path.join(pathsDir, file));
        paths = { ...paths, ...pathModule };
      }
    });
  }

  return paths;
};

const options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "Talabat Clone REST API",
      version: "1.0.0",
      description:
        "A production-ready RESTful API for a food delivery platform built with Node.js, Express, Prisma, PostgreSQL, Redis, BullMQ, Socket.IO, and Docker.",

      contact: {
        name: "Essam Alaa",
        email: "essamalaa5500@gmail.com",
        url: "https://github.com/essamalaa5500-hue",
      },

      license: {
        name: "MIT",
      },
    },

    servers: [
      {
        url: "https://talabat-clone-api.runsite.app",
        description: "Production Server",
      },
      {
        url: "http://localhost:3000",
        description: "Development Server",
      },
    ],

    tags: [
      {
        name: "Authentication",
        description: "Authentication and authorization",
      },
      {
        name: "Users",
        description: "Users management",
      },
      {
        name: "Restaurants",
        description: "Restaurants management",
      },
      {
        name: "Branches",
        description: "Restaurant branches",
      },
      {
        name: "Cuisines",
        description: "Restaurant cuisines",
      },
      {
        name: "Menu Categories",
        description: "Restaurant menu categories",
      },
      {
        name: "Products",
        description: "Products management",
      },
      {
        name: "Product Variants",
        description: "Product variants",
      },
      {
        name: "Product Images",
        description: "Product images",
      },
      {
        name: "Product Options",
        description: "Product options",
      },
      {
        name: "Cart",
        description: "Shopping cart",
      },
      {
        name: "Orders",
        description: "Orders management",
      },
      {
        name: "Payments",
        description: "Payment operations",
      },
      {
        name: "Deliveries",
        description: "Delivery operations",
      },
      {
        name: "Coupons",
        description: "Coupons and discounts",
      },
      {
        name: "Drivers",
        description: "Drivers management",
      },
      {
        name: "Reviews",
        description: "Restaurant & Driver reviews",
      },
      {
        name: "Notifications",
        description: "Notifications",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: loadSchemas(),
    },

    paths: loadPaths(),

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
