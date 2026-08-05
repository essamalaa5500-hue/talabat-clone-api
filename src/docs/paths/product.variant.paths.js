module.exports = {
  "/product-variants/product/{productId}": {
    get: {
      tags: ["Product Variants"],
      summary: "Get product variants",
      description:
        "Get all variants for a specific product (available for customers and restaurant owners).",
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
          description: "Product variants fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  total: {
                    type: "integer",
                    example: 2,
                  },
                  variants: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/ProductVariant",
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
      tags: ["Product Variants"],
      summary: "Create product variant",
      description:
        "Create a new variant (e.g., Small, Medium, Large) for a product.",
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
              $ref: "#/components/schemas/CreateProductVariantInput",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Variant created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Variant created successfully",
                  },
                  variant: {
                    $ref: "#/components/schemas/ProductVariant",
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
          description: "Variant already exists",
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

  "/product-variants/{id}": {
    patch: {
      tags: ["Product Variants"],
      summary: "Update product variant",
      description:
        "Update details of a product variant (e.g., name, price, discount price).",
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
          description: "Variant ID",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateProductVariantInput",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Variant updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Variant updated successfully",
                  },
                  variant: {
                    type: "object",
                    allOf: [
                      { $ref: "#/components/schemas/ProductVariant" },
                      {
                        type: "object",
                        properties: {
                          product: {
                            type: "object",
                            properties: {
                              id: {
                                type: "string",
                                format: "uuid",
                              },
                              name: {
                                type: "string",
                                example: "Pizza Margherita",
                              },
                            },
                          },
                        },
                      },
                    ],
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
          description: "Variant not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        409: {
          description: "Variant name already exists",
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
      tags: ["Product Variants"],
      summary: "Delete product variant",
      description: "Soft delete a product variant.",
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
          description: "Variant ID",
        },
      ],
      responses: {
        200: {
          description: "Variant deleted successfully",
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
          description: "Variant not found",
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

  "/product-variants/{id}/status": {
    patch: {
      tags: ["Product Variants"],
      summary: "Update product variant status",
      description:
        "Update the availability status of a product variant (AVAILABLE, OUT_OF_STOCK, UNAVAILABLE).",
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
          description: "Variant ID",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateProductVariantStatusInput",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Variant status updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Variant status updated successfully",
                  },
                  variant: {
                    type: "object",
                    allOf: [
                      { $ref: "#/components/schemas/ProductVariant" },
                      {
                        type: "object",
                        properties: {
                          product: {
                            type: "object",
                            properties: {
                              id: {
                                type: "string",
                                format: "uuid",
                              },
                              name: {
                                type: "string",
                                example: "Pizza Margherita",
                              },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        400: {
          description:
            "Validation error, invalid status, or status already set to this value",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Variant not found",
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
