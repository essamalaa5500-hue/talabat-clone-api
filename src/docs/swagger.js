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
      title: "Talabat API",
      version: "1.0.0",
      description: "Talabat Clone Backend API",
      contact: {
        name: "Essam Alaa",
      },
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Development Server",
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
