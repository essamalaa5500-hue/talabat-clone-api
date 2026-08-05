module.exports = {
  Address: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      branchId: {
        type: "string",
        format: "uuid",
      },

      country: {
        type: "string",
        example: "Egypt",
      },

      city: {
        type: "string",
        example: "Cairo",
      },

      area: {
        type: "string",
        example: "Nasr City",
      },

      street: {
        type: "string",
        example: "Makram Ebeid",
      },

      building: {
        type: "string",
        example: "15",
      },

      floor: {
        type: "string",
        nullable: true,
        example: "3",
      },

      apartment: {
        type: "string",
        nullable: true,
        example: "12",
      },

      latitude: {
        type: "number",
        format: "double",
        example: 30.061686,
      },

      longitude: {
        type: "number",
        format: "double",
        example: 31.326008,
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
};
