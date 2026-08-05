module.exports = {
  "/restaurant-reviews/my-reviews": {
    get: {
      tags: ["Restaurant Reviews"],
      summary: "Get current user's restaurant reviews",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        {
          name: "limit",
          in: "query",
          schema: { type: "integer", default: 10 },
        },
        {
          name: "sort",
          in: "query",
          schema: { type: "string" },
          example: "-createdAt",
        },
      ],
      responses: {
        200: {
          description: "Reviews retrieved successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RestaurantReviewListResponse",
              },
            },
          },
        },
        401: { description: "Unauthorized" },
        403: { description: "Forbidden - Customer only" },
      },
    },
  },

  "/restaurant-reviews/order/{orderId}": {
    get: {
      tags: ["Restaurant Reviews"],
      summary: "Get restaurant review details by Order ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "orderId",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      responses: {
        200: {
          description: "Review details retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  review: {
                    $ref: "#/components/schemas/RestaurantReviewDetails",
                  },
                },
              },
            },
          },
        },
        404: { description: "Restaurant review not found" },
      },
    },
  },

  "/restaurant-reviews/restaurant/{restaurantId}": {
    get: {
      tags: ["Restaurant Reviews"],
      summary: "Get reviews for a specific restaurant",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "restaurantId",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        {
          name: "limit",
          in: "query",
          schema: { type: "integer", default: 10 },
        },
        {
          name: "sort",
          in: "query",
          schema: { type: "string" },
          example: "-rating",
        },
      ],
      responses: {
        200: {
          description: "Restaurant reviews retrieved successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RestaurantReviewListResponse",
              },
            },
          },
        },
        404: { description: "Restaurant not found" },
      },
    },
  },

  "/restaurant-reviews/{orderId}": {
    post: {
      tags: ["Restaurant Reviews"],
      summary: "Create a restaurant review for a delivered order",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "orderId",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateRestaurantReviewInput",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Restaurant review created successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RestaurantReviewResponse" },
            },
          },
        },
        400: { description: "Invalid review data or review already exists" },
        404: { description: "Delivered order not found" },
      },
    },

    patch: {
      tags: ["Restaurant Reviews"],
      summary: "Update an existing restaurant review",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "orderId",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateRestaurantReviewInput",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Restaurant review updated successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RestaurantReviewResponse" },
            },
          },
        },
        400: { description: "Invalid review data" },
        403: { description: "Forbidden - Not the owner of this review" },
        404: { description: "Restaurant review not found" },
      },
    },

    delete: {
      tags: ["Restaurant Reviews"],
      summary: "Soft delete a restaurant review",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "orderId",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      responses: {
        200: {
          description: "Restaurant review deleted successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Restaurant review deleted successfully",
                  },
                },
              },
            },
          },
        },
        403: { description: "Forbidden - Not the owner of this review" },
        404: { description: "Restaurant review not found" },
      },
    },
  },
};
