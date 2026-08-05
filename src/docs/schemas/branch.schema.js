module.exports = {
  BranchRestaurant: {
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

      createdAt: {
        type: "string",
        format: "date-time",
      },
    },
  },

  Branch: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      name: {
        type: "string",
        example: "Nasr City Branch",
      },

      description: {
        type: "string",
        nullable: true,
        example: "Main Branch",
      },

      phone: {
        type: "string",
        example: "01012345678",
      },

      deliveryFee: {
        type: "number",
        example: 35,
      },

      minimumOrderAmount: {
        type: "number",
        example: 150,
      },

      averageDeliveryTime: {
        type: "integer",
        example: 45,
      },

      status: {
        type: "string",
        enum: ["ACTIVE", "INACTIVE"],
      },

      restaurant: {
        $ref: "#/components/schemas/BranchRestaurant",
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

  CreateBranchInput: {
    type: "object",

    required: [
      "restaurantId",
      "name",
      "phone",
      "deliveryFee",
      "minimumOrderAmount",
      "averageDeliveryTime",
    ],

    properties: {
      restaurantId: {
        type: "string",
        format: "uuid",
      },

      name: {
        type: "string",
        example: "Nasr City Branch",
      },

      description: {
        type: "string",
        example: "Main Branch",
      },

      phone: {
        type: "string",
        example: "01012345678",
      },

      deliveryFee: {
        type: "number",
        example: 35,
      },

      minimumOrderAmount: {
        type: "number",
        example: 150,
      },

      averageDeliveryTime: {
        type: "integer",
        example: 45,
      },
    },
  },

  UpdateBranchInput: {
    type: "object",

    properties: {
      name: {
        type: "string",
      },

      description: {
        type: "string",
      },

      phone: {
        type: "string",
      },

      deliveryFee: {
        type: "number",
      },

      minimumOrderAmount: {
        type: "number",
      },

      averageDeliveryTime: {
        type: "integer",
      },
    },
  },

  UpdateBranchStatusInput: {
    type: "object",

    required: ["status"],

    properties: {
      status: {
        type: "string",
        enum: ["ACTIVE", "INACTIVE"],
      },
    },
  },

  BranchResponse: {
    type: "object",

    properties: {
      branch: {
        $ref: "#/components/schemas/Branch",
      },
    },
  },

  BranchesResponse: {
    type: "object",

    properties: {
      branches: {
        type: "array",

        items: {
          $ref: "#/components/schemas/Branch",
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
            example: 45,
          },

          totalPages: {
            type: "integer",
            example: 5,
          },
        },
      },
    },
  },
};
