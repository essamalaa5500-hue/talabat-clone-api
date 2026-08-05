module.exports = {
  "/cart": {
    post: {
      tags: ["Cart"],
      summary: "Add product to cart",
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
              $ref: "#/components/schemas/AddToCartInput",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Product added to cart successfully",
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
                      item: {
                        $ref: "#/components/schemas/CartItem",
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        400: {
          description: "Validation error or product unavailable",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Branch or Variant not found",
        },
      },
    },

    get: {
      tags: ["Cart"],
      summary: "Get my cart",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Cart fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CartResponse",
              },
            },
          },
        },
        404: {
          description: "Cart not found",
        },
      },
    },

    delete: {
      tags: ["Cart"],
      summary: "Clear cart",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Cart cleared successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageResponse",
              },
            },
          },
        },
        404: {
          description: "Cart not found",
        },
      },
    },
  },

  "/cart/item/{itemId}": {
    patch: {
      tags: ["Cart"],
      summary: "Update cart item quantity",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "itemId",
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
              $ref: "#/components/schemas/UpdateCartItemInput",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Quantity updated successfully",
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
                      item: {
                        $ref: "#/components/schemas/CartItem",
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        400: {
          description: "Invalid quantity",
        },
        404: {
          description: "Cart item not found",
        },
      },
    },

    delete: {
      tags: ["Cart"],
      summary: "Delete cart item",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "itemId",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      responses: {
        200: {
          description: "Cart item deleted successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageResponse",
              },
            },
          },
        },
        404: {
          description: "Cart item not found",
        },
      },
    },
  },
};
