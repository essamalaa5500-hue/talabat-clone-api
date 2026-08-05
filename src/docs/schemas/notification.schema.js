module.exports = {
  Notification: {
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

      orderId: {
        type: "string",
        format: "uuid",
        nullable: true,
      },

      type: {
        type: "string",
        example: "ORDER",
      },

      title: {
        type: "string",
        example: "Order Accepted",
      },

      body: {
        type: "string",
        example: "Your order has been accepted successfully.",
      },

      isRead: {
        type: "boolean",
        example: false,
      },

      readAt: {
        type: "string",
        format: "date-time",
        nullable: true,
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

  NotificationResponse: {
    type: "object",

    properties: {
      notification: {
        $ref: "#/components/schemas/NotificationDetails",
      },
    },
  },

  NotificationDetails: {
    allOf: [
      {
        $ref: "#/components/schemas/Notification",
      },
      {
        type: "object",

        properties: {
          order: {
            nullable: true,

            type: "object",

            properties: {
              id: {
                type: "string",
                format: "uuid",
              },

              status: {
                type: "string",
                example: "CONFIRMED",
              },
            },
          },
        },
      },
    ],
  },

  NotificationListResponse: {
    type: "object",

    properties: {
      notifications: {
        type: "array",

        items: {
          $ref: "#/components/schemas/NotificationDetails",
        },
      },

      pagination: {
        $ref: "#/components/schemas/Pagination",
      },
    },
  },

  NotificationMessageResponse: {
    type: "object",

    properties: {
      message: {
        type: "string",
        example: "Notification marked as read successfully",
      },
    },
  },
};
