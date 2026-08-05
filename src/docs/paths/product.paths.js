module.exports = {
  "/products/restaurant/{restaurantId}": {
    get: {
      tags: ["Products"],
      summary: "Get restaurant products",
      description:
        "Get all active products for a specific restaurant with pagination, search, and sorting.",
      parameters: [
        {
          in: "path",
          name: "restaurantId",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
        {
          in: "query",
          name: "page",
          schema: {
            type: "integer",
            default: 1,
          },
        },
        {
          in: "query",
          name: "limit",
          schema: {
            type: "integer",
            default: 10,
          },
        },
        {
          in: "query",
          name: "search",
          schema: {
            type: "string",
          },
        },
        {
          in: "query",
          name: "sort",
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "Products fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  products: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Product",
                    },
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      page: { type: "integer", example: 1 },
                      limit: { type: "integer", example: 10 },
                      total: { type: "integer", example: 25 },
                      totalPages: { type: "integer", example: 3 },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Validation error or missing restaurantId",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Restaurant not found",
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

  "/products/restaurant/{restaurantId}/{id}": {
    get: {
      tags: ["Products"],
      summary: "Get product by ID",
      description:
        "Get detailed information about a single product including variants, options, and images.",
      parameters: [
        {
          in: "path",
          name: "restaurantId",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      responses: {
        200: {
          description: "Product details fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  product: {
                    $ref: "#/components/schemas/Product",
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
          description: "Restaurant or Product not found",
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

  "/products": {
    post: {
      tags: ["Products"],
      summary: "Create product",
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateProductInput",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Product created successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  {
                    $ref: "#/components/schemas/MessageResponse",
                  },
                  {
                    type: "object",
                    properties: {
                      product: {
                        $ref: "#/components/schemas/Product",
                      },
                    },
                  },
                ],
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
          description: "Menu category not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        409: {
          description: "Product already exists",
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

  "/products/{id}": {
    patch: {
      tags: ["Products"],
      summary: "Update product",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateProductInput",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Product updated successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  {
                    $ref: "#/components/schemas/MessageResponse",
                  },
                  {
                    type: "object",
                    properties: {
                      product: {
                        $ref: "#/components/schemas/Product",
                      },
                    },
                  },
                ],
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
          description: "Product name already exists",
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
      tags: ["Products"],
      summary: "Delete product",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      responses: {
        200: {
          description: "Product deleted successfully",
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
  },

  "/products/{id}/status": {
    patch: {
      tags: ["Products"],
      summary: "Update product status",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateProductStatusInput",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Product status updated successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  {
                    $ref: "#/components/schemas/MessageResponse",
                  },
                  {
                    type: "object",
                    properties: {
                      product: {
                        $ref: "#/components/schemas/Product",
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        400: {
          description: "Validation error or product already has this status",
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
  },
};
