module.exports = {
  MenuCategoryRestaurant: {
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
    },
  },

  MenuCategory: {
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

      restaurant: {
        $ref: "#/components/schemas/MenuCategoryRestaurant",
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

  CreateMenuCategoryInput: {
    type: "object",

    required: ["name"],

    properties: {
      name: {
        type: "string",
        example: "Sandwiches",
      },
    },
  },

  UpdateMenuCategoryInput: {
    type: "object",

    properties: {
      name: {
        type: "string",
        example: "Meals",
      },
    },
  },

  MenuCategoryResponse: {
    type: "object",

    properties: {
      menuCategory: {
        $ref: "#/components/schemas/MenuCategory",
      },
    },
  },

  MenuCategoriesResponse: {
    type: "object",

    properties: {
      menuCategories: {
        type: "array",

        items: {
          $ref: "#/components/schemas/MenuCategory",
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

  MenuCategoryMessageResponse: {
    type: "object",

    properties: {
      message: {
        type: "string",
        example: "Menu category created successfully",
      },

      menuCategory: {
        $ref: "#/components/schemas/MenuCategory",
      },
    },
  },

  MessageResponse: {
    type: "object",

    properties: {
      message: {
        type: "string",
        example: "Menu category deleted successfully",
      },
    },
  },
};
