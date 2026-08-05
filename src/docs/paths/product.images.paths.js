module.exports = {
  "/product-images/product/{id}": {
    post: {
      tags: ["Product Images"],
      summary: "Upload product image",
      description:
        "Upload a new gallery image for a specific product to Cloudinary.",
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
          description: "Product ID",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              $ref: "#/components/schemas/UploadProductImageInput",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Image uploaded successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Image uploaded successfully",
                  },
                  image: {
                    $ref: "#/components/schemas/ProductImage",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "No image provided or validation error",
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

    get: {
      tags: ["Product Images"],
      summary: "Get product images",
      description: "Get all active images associated with a specific product.",
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
          description: "Product ID",
        },
      ],
      responses: {
        200: {
          description: "Product images fetched successfully",
          content: {
            "application/json": {
              schema: {
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
                        example: "Double Beef Burger",
                      },
                    },
                  },
                  total: {
                    type: "integer",
                    example: 3,
                  },
                  images: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/ProductImage",
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
  },

  "/product-images/{id}": {
    delete: {
      tags: ["Product Images"],
      summary: "Delete product image",
      description:
        "Delete an image from Cloudinary and mark it as deleted in the database.",
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
          description: "Image ID",
        },
      ],
      responses: {
        200: {
          description: "Image deleted successfully",
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
          description: "Image not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        500: {
          description: "Failed to delete image from Cloudinary",
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

  "/product-images/{id}/main": {
    patch: {
      tags: ["Product Images"],
      summary: "Set main product image",
      description:
        "Change a gallery image to be the main image of the product.",
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
          description: "Image ID",
        },
      ],
      responses: {
        200: {
          description: "Main image updated successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SetMainProductImageResponse",
              },
            },
          },
        },
        400: {
          description: "Validation error or image is already the main image",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Image not found",
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
