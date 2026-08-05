module.exports = {
  OptionValue: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      productOptionId: {
        type: "string",
        format: "uuid",
      },

      name: {
        type: "string",
        example: "Extra Cheese",
      },

      extraPrice: {
        type: "number",
        example: 20,
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

  CreateOptionValueInput: {
    type: "object",

    required: ["name", "extraPrice"],

    properties: {
      name: {
        type: "string",
        example: "Extra Cheese",
      },

      extraPrice: {
        type: "number",
        example: 20,
      },
    },
  },

  UpdateOptionValueInput: {
    type: "object",

    properties: {
      name: {
        type: "string",
        example: "Double Cheese",
      },

      extraPrice: {
        type: "number",
        example: 30,
      },
    },
  },
};
