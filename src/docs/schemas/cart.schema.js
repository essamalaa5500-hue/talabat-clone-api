module.exports = {
  Cart: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      userId: {
        type: "string",
        format: "uuid",
      },

      restaurantId: {
        type: "string",
        format: "uuid",
      },

      restaurant: {
        $ref: "#/components/schemas/Restaurant",
      },

      branchId: {
        type: "string",
        format: "uuid",
      },

      branch: {
        $ref: "#/components/schemas/Branch",
      },

      items: {
        type: "array",
        items: {
          $ref: "#/components/schemas/CartItem",
        },
      },

      createdAt: {
        type: "string",
        format: "date-time",
      },

      updatedAt: {
        type: "string",
        format: "date-time",
      },
    },
  },

  CartItem: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      cartId: {
        type: "string",
        format: "uuid",
      },

      productVariantId: {
        type: "string",
        format: "uuid",
      },

      quantity: {
        type: "integer",
        example: 2,
      },

      unitPrice: {
        type: "number",
        format: "double",
        example: 180,
      },

      totalPrice: {
        type: "number",
        format: "double",
        example: 360,
      },

      productVariant: {
        $ref: "#/components/schemas/ProductVariant",
      },

      options: {
        type: "array",
        items: {
          $ref: "#/components/schemas/CartItemOption",
        },
      },
    },
  },

  CartItemOption: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      optionValueId: {
        type: "string",
        format: "uuid",
      },

      extraPrice: {
        type: "number",
        format: "double",
        example: 20,
      },

      optionValue: {
        $ref: "#/components/schemas/OptionValue",
      },
    },
  },

  CartResponse: {
    type: "object",

    properties: {
      cart: {
        $ref: "#/components/schemas/Cart",
      },

      totalItems: {
        type: "integer",
        example: 4,
      },

      subtotal: {
        type: "number",
        format: "double",
        example: 360,
      },
    },
  },

  AddToCartInput: {
    type: "object",

    required: ["branchId", "productVariantId", "quantity"],

    properties: {
      branchId: {
        type: "string",
        format: "uuid",
      },

      productVariantId: {
        type: "string",
        format: "uuid",
      },

      quantity: {
        type: "integer",
        example: 2,
      },

      optionValueIds: {
        type: "array",

        items: {
          type: "string",
          format: "uuid",
        },

        example: [
          "ec5ef53e-70b2-42b4-a034-b11cb4c6eb6d",
          "8e5ef53e-70b2-42b4-a034-b11cb4c6eb61",
        ],
      },
    },
  },

  UpdateCartItemInput: {
    type: "object",

    required: ["quantity"],

    properties: {
      quantity: {
        type: "integer",
        example: 3,
      },
    },
  },
};
