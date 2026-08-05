module.exports = {
  RestaurantReview: {
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
      orderId: {
        type: "string",
        format: "uuid",
      },
      rating: {
        type: "integer",
        minimum: 1,
        maximum: 5,
        example: 5,
      },
      comment: {
        type: "string",
        nullable: true,
        example: "Amazing food and fast delivery.",
      },
      restaurantReply: {
        type: "string",
        nullable: true,
        example: "Thank you for your feedback ❤️",
      },
      repliedAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },
      deletedAt: {
        type: "string",
        format: "date-time",
        nullable: true,
        example: null,
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

  CreateRestaurantReviewInput: {
    type: "object",
    required: ["rating"],
    properties: {
      rating: {
        type: "integer",
        minimum: 1,
        maximum: 5,
        example: 5,
      },
      comment: {
        type: "string",
        maxLength: 500,
        example: "Everything was perfect.",
      },
    },
  },

  UpdateRestaurantReviewInput: {
    type: "object",
    properties: {
      rating: {
        type: "integer",
        minimum: 1,
        maximum: 5,
        example: 4,
      },
      comment: {
        type: "string",
        maxLength: 500,
        example: "Food was good but delivery was a bit late.",
      },
    },
  },

  RestaurantReviewResponse: {
    type: "object",
    properties: {
      message: {
        type: "string",
        example: "Restaurant review created successfully",
      },
      review: {
        $ref: "#/components/schemas/RestaurantReview",
      },
    },
  },

  RestaurantReviewDetails: {
    allOf: [
      {
        $ref: "#/components/schemas/RestaurantReview",
      },
      {
        type: "object",
        properties: {
          user: {
            type: "object",
            properties: {
              id: {
                type: "string",
                format: "uuid",
              },
              fullName: {
                type: "string",
                example: "Essam Alaa",
              },
              avatar: {
                type: "string",
                nullable: true,
                example: "https://example.com/avatar.jpg",
              },
            },
          },
          restaurant: {
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
          order: {
            type: "object",
            properties: {
              id: {
                type: "string",
                format: "uuid",
              },
              status: {
                type: "string",
                example: "DELIVERED",
              },
            },
          },
        },
      },
    ],
  },

  RestaurantReviewListResponse: {
    type: "object",
    properties: {
      reviews: {
        type: "array",
        items: {
          $ref: "#/components/schemas/RestaurantReviewDetails",
        },
      },
      pagination: {
        $ref: "#/components/schemas/Pagination",
      },
    },
  },
};
