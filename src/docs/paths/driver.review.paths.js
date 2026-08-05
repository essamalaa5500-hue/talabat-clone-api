module.exports = {
  "/driver-reviews/{orderId}": {
    post: {
      tags: ["Driver Reviews"],
      summary: "Create driver review",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "orderId",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateDriverReviewInput",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Driver review created successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DriverReviewResponse",
              },
            },
          },
        },
        400: {
          description: "Order already reviewed or invalid data",
        },
        404: {
          description: "Delivered order not found",
        },
      },
    },

    patch: {
      tags: ["Driver Reviews"],
      summary: "Update driver review",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "orderId",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateDriverReviewInput",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Driver review updated successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DriverReviewResponse",
              },
            },
          },
        },
        403: {
          description: "You are not the owner of this review",
        },
        404: {
          description: "Driver review not found",
        },
      },
    },

    delete: {
      tags: ["Driver Reviews"],
      summary: "Delete driver review",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "orderId",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      responses: {
        200: {
          description: "Driver review deleted successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageResponse",
              },
            },
          },
        },
        403: {
          description: "You are not the owner of this review",
        },
        404: {
          description: "Driver review not found",
        },
      },
    },
  },

  "/driver-reviews/order/{orderId}": {
    get: {
      tags: ["Driver Reviews"],
      summary: "Get driver review by order id",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "orderId",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      responses: {
        200: {
          description: "Driver review fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DriverReviewDetails",
              },
            },
          },
        },
        404: {
          description: "Driver review not found",
        },
      },
    },
  },

  "/driver-reviews/driver/{driverId}": {
    get: {
      tags: ["Driver Reviews"],
      summary: "Get all reviews for a driver",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "driverId",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
        {
          in: "query",
          name: "page",
          schema: {
            type: "integer",
            example: 1,
          },
        },
        {
          in: "query",
          name: "limit",
          schema: {
            type: "integer",
            example: 10,
          },
        },
        {
          in: "query",
          name: "sort",
          schema: {
            type: "string",
            example: "-createdAt",
          },
        },
      ],
      responses: {
        200: {
          description: "Driver reviews fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DriverReviewListResponse",
              },
            },
          },
        },
        404: {
          description: "Driver not found",
        },
      },
    },
  },

  "/driver-reviews/my-reviews": {
    get: {
      tags: ["Driver Reviews"],
      summary: "Get my reviews",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "query",
          name: "page",
          schema: {
            type: "integer",
            example: 1,
          },
        },
        {
          in: "query",
          name: "limit",
          schema: {
            type: "integer",
            example: 10,
          },
        },
        {
          in: "query",
          name: "sort",
          schema: {
            type: "string",
            example: "-createdAt",
          },
        },
      ],
      responses: {
        200: {
          description: "My reviews fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DriverReviewListResponse",
              },
            },
          },
        },
      },
    },
  },
};
