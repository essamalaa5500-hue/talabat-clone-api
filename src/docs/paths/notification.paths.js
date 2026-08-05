module.exports = {
  "/notifications/my": {
    get: {
      tags: ["Notifications"],
      summary: "Get my notifications",
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
          description: "Notifications fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NotificationListResponse",
              },
            },
          },
        },
      },
    },
  },

  "/notifications/{id}": {
    get: {
      tags: ["Notifications"],
      summary: "Get notification by id",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      responses: {
        200: {
          description: "Notification fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NotificationResponse",
              },
            },
          },
        },
        404: {
          description: "Notification not found",
        },
      },
    },

    delete: {
      tags: ["Notifications"],
      summary: "Delete notification",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      responses: {
        200: {
          description: "Notification deleted successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NotificationMessageResponse",
              },
            },
          },
        },
        404: {
          description: "Notification not found",
        },
      },
    },
  },

  "/notifications/{id}/read": {
    patch: {
      tags: ["Notifications"],
      summary: "Mark notification as read",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      responses: {
        200: {
          description: "Notification marked as read successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NotificationMessageResponse",
              },
            },
          },
        },
        404: {
          description: "Notification not found",
        },
      },
    },
  },

  "/notifications/read": {
    patch: {
      tags: ["Notifications"],
      summary: "Mark all notifications as read",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "All notifications marked as read successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NotificationMessageResponse",
              },
            },
          },
        },
      },
    },
  },
};
