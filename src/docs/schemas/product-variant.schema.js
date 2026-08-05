module.exports = {
  ProductVariant: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      productId: {
        type: "string",
        format: "uuid",
      },

      name: {
        type: "string",
        example: "Large",
      },

      price: {
        type: "number",
        example: 220,
      },

      discountPrice: {
        type: "number",
        nullable: true,
        example: 180,
      },

      status: {
        type: "string",
        enum: ["AVAILABLE", "OUT_OF_STOCK", "UNAVAILABLE"],
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

  CreateProductVariantInput: {
    type: "object",

    required: ["name", "price"],

    properties: {
      name: {
        type: "string",
        example: "Large",
      },

      price: {
        type: "number",
        example: 220,
      },

      discountPrice: {
        type: "number",
        nullable: true,
        example: 180,
      },
    },
  },

  UpdateProductVariantInput: {
    type: "object",

    properties: {
      name: {
        type: "string",
        example: "Medium",
      },

      price: {
        type: "number",
        example: 200,
      },

      discountPrice: {
        type: "number",
        nullable: true,
        example: 170,
      },
    },
  },

  UpdateProductVariantStatusInput: {
    type: "object",

    required: ["status"],

    properties: {
      status: {
        type: "string",
        enum: ["AVAILABLE", "OUT_OF_STOCK", "UNAVAILABLE"],
      },
    },
  },
};
