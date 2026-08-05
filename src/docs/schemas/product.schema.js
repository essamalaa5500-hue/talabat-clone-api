module.exports = {
  Product: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      name: {
        type: "string",
        example: "Zinger Sandwich",
      },

      description: {
        type: "string",
        nullable: true,
        example: "Spicy crispy chicken sandwich",
      },

      status: {
        type: "string",
        enum: ["AVAILABLE", "UNAVAILABLE"],
      },

      menuCategory: {
        type: "object",   
        properties: {
          id: {
            type: "string",
            format: "uuid",
          },

          name: {
            type: "string",
            example: "Sandwiches",
          },
        },
      },

      variants: {
        type: "array",
        items: {
          $ref: "#/components/schemas/ProductVariant",
        },
      },

      images: {
        type: "array",
        items: {
          $ref: "#/components/schemas/ProductImage",
        },
      },

      options: {
        type: "array",
        items: {
          $ref: "#/components/schemas/ProductOption",
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

  CreateProductInput: {
    type: "object",

    required: ["menuCategoryId", "name"],

    properties: {
      menuCategoryId: {
        type: "string",
        format: "uuid",
      },

      name: {
        type: "string",
        example: "Zinger Sandwich",
      },

      description: {
        type: "string",
        example: "Spicy crispy chicken sandwich",
      },
    },
  },

  UpdateProductInput: {
    type: "object",

    properties: {
      name: {
        type: "string",
        example: "Zinger Sandwich Large",
      },

      description: {
        type: "string",
        example: "Updated description",
      },
    },
  },

  UpdateProductStatusInput: {
    type: "object",

    required: ["status"],

    properties: {
      status: {
        type: "string",
        enum: ["AVAILABLE", "UNAVAILABLE"],
      },
    },
  },
};
