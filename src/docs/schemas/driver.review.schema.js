module.exports = {
  DriverReview: {
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

      driverId: {
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
        example: "Very friendly driver.",
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

  CreateDriverReviewInput: {
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
        example: "Excellent delivery service.",
      },
    },
  },

  UpdateDriverReviewInput: {
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
        example: "Driver was polite and arrived on time.",
      },
    },
  },

  DriverReviewResponse: {
    type: "object",

    properties: {
      message: {
        type: "string",
        example: "Driver review created successfully",
      },

      review: {
        $ref: "#/components/schemas/DriverReview",
      },
    },
  },

  DriverReviewDetails: {
    allOf: [
      {
        $ref: "#/components/schemas/DriverReview",
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

          driver: {
            type: "object",

            properties: {
              id: {
                type: "string",
                format: "uuid",
              },

              user: {
                type: "object",

                properties: {
                  id: {
                    type: "string",
                    format: "uuid",
                  },

                  fullName: {
                    type: "string",
                    example: "Ahmed Mohamed",
                  },

                  phone: {
                    type: "string",
                    example: "01012345678",
                  },

                  avatar: {
                    type: "string",
                    nullable: true,
                    example: "https://example.com/avatar.jpg",
                  },
                },
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
            },
          },
        },
      },
    ],
  },

  DriverReviewListResponse: {
    type: "object",

    properties: {
      reviews: {
        type: "array",

        items: {
          $ref: "#/components/schemas/DriverReviewDetails",
        },
      },

      pagination: {
        $ref: "#/components/schemas/Pagination",
      },
    },
  },
};
