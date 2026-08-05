module.exports = {
  ProductOption: {
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
        example: "Choose Size",
      },

      isRequired: {
        type: "boolean",
        example: true,
      },

      maxSelections: {
        type: "integer",
        example: 1,
      },

      values: {
        type: "array",
        items: {
          $ref: "#/components/schemas/OptionValue",
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

  CreateProductOptionInput: {
    type: "object",

    required: ["name", "isRequired", "maxSelections"],

    properties: {
      name: {
        type: "string",
        example: "Choose Size",
      },

      isRequired: {
        type: "boolean",
        example: true,
      },

      maxSelections: {
        type: "integer",
        example: 1,
      },
    },
  },

  UpdateProductOptionInput: {
    type: "object",

    properties: {
      name: {
        type: "string",
        example: "Choose Bread",
      },

      isRequired: {
        type: "boolean",
      },

      maxSelections: {
        type: "integer",
      },
    },
  },
};
