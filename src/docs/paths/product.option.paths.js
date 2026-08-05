module.exports = {
  "/product-options/product/{productId}": {
    get: {
      tags: ["Product Options"],
      summary: "Get product options",
      description:
        "Get all options (with their values) for a specific product.",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "productId",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
          description: "Product ID",
        },
      ],
      responses: {
        200: {
          description: "Product options fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  total: {
                    type: "integer",
                    example: 2,
                  },
                  options: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/ProductOption",
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Validation error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Product not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },

    post: {
      tags: ["Product Options"],
      summary: "Create product option",
      description:
        "Create a new option group (e.g., Choose Size, Choose Extras) for a product.",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "productId",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
          description: "Product ID",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateProductOptionInput",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Option created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Option created successfully",
                  },
                  option: {
                    $ref: "#/components/schemas/ProductOption",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Validation error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Product not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        409: {
          description: "Option already exists",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },

  "/product-options/product/{productId}/{optionId}": {
    get: {
      tags: ["Product Options"],
      summary: "Get product option by ID",
      description:
        "Get detailed information about a single product option including its values.",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "productId",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
          description: "Product ID",
        },
        {
          in: "path",
          name: "optionId",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
          description: "Option ID",
        },
      ],
      responses: {
        200: {
          description: "Product option fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  option: {
                    $ref: "#/components/schemas/ProductOption",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Validation error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Product or Option not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },

    patch: {
      tags: ["Product Options"],
      summary: "Update product option",
      description:
        "Update product option details such as name, requirement status, or max selections.",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "productId",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
          description: "Product ID",
        },
        {
          in: "path",
          name: "optionId",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
          description: "Option ID",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateProductOptionInput",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Option updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Option updated successfully",
                  },
                  option: {
                    $ref: "#/components/schemas/ProductOption",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Validation error or no data provided",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Product or Option not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        409: {
          description: "Option already exists",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },

    delete: {
      tags: ["Product Options"],
      summary: "Delete product option",
      description:
        "Soft delete a product option and all its associated option values.",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "productId",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
          description: "Product ID",
        },
        {
          in: "path",
          name: "optionId",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
          description: "Option ID",
        },
      ],
      responses: {
        200: {
          description: "Option deleted successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageResponse",
              },
            },
          },
        },
        400: {
          description: "Validation error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Product or Option not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },
};
