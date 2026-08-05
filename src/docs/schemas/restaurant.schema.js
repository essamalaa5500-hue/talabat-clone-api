module.exports = {
  RestaurantCuisine: {
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
    },
  },

  Restaurant: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      name: {
        type: "string",
        example: "KFC",
      },

      description: {
        type: "string",
        example: "Best Fried Chicken",
      },

      status: {
        type: "string",
        enum: ["PENDING", "ACTIVE", "REJECTED", "SUSPENDED"],
      },

      cuisines: {
        type: "array",

        items: {
          $ref: "#/components/schemas/RestaurantCuisine",
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

  CreateRestaurantInput: {
    type: "object",

    required: ["name", "description", "cuisines"],

    properties: {
      name: {
        type: "string",
        example: "KFC",
      },

      description: {
        type: "string",
        example: "Best Fried Chicken",
      },

      cuisines: {
        type: "array",

        items: {
          type: "string",
          format: "uuid",
        },

        example: ["uuid-1", "uuid-2"],
      },
    },
  },

  UpdateRestaurantInput: {
    type: "object",

    properties: {
      name: {
        type: "string",
        example: "KFC Egypt",
      },

      description: {
        type: "string",
        example: "Updated Description",
      },
    },
  },

  UpdateRestaurantStatusInput: {
    type: "object",

    required: ["status"],

    properties: {
      status: {
        type: "string",

        enum: ["PENDING", "ACTIVE", "REJECTED", "SUSPENDED"],
      },
    },
  },

  RestaurantResponse: {
    type: "object",

    properties: {
      restaurant: {
        $ref: "#/components/schemas/Restaurant",
      },
    },
  },

  RestaurantsResponse: {
    type: "object",

    properties: {
      restaurants: {
        type: "array",

        items: {
          $ref: "#/components/schemas/Restaurant",
        },
      },
    },
  },

  RestaurantsPaginationResponse: {
    type: "object",

    properties: {
      restaurants: {
        type: "array",

        items: {
          $ref: "#/components/schemas/Restaurant",
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
            example: 35,
          },

          totalPages: {
            type: "integer",
            example: 4,
          },
        },
      },
    },
  },
};
