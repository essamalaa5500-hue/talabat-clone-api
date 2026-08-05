module.exports = {
  Cuisine: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      name: {
        type: "string",
        example: "Italian",
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

  CreateCuisineInput: {
    type: "object",

    required: ["name"],

    properties: {
      name: {
        type: "string",
        example: "Italian",
      },
    },
  },

  UpdateCuisineInput: {
    type: "object",

    properties: {
      name: {
        type: "string",
        example: "American",
      },
    },
  },

  CuisineResponse: {
    type: "object",

    properties: {
      cuisine: {
        $ref: "#/components/schemas/Cuisine",
      },
    },
  },

  CuisinesResponse: {
    type: "object",

    properties: {
      cuisines: {
        type: "array",

        items: {
          $ref: "#/components/schemas/Cuisine",
        },
      },

      pagination: {
        type: "object",

        properties: {
          page: {
            type: "integer",
            example: 1,
          },

          limit: {
            type: "integer",
            example: 10,
          },

          total: {
            type: "integer",
            example: 25,
          },

          totalPages: {
            type: "integer",
            example: 3,
          },
        },
      },
    },
  },
};
