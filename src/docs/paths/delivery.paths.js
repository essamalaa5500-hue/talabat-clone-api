module.exports = {
  "/delivery/assign-driver/{orderId}": {
    patch: {
      tags: ["Delivery"],
      summary: "Assign driver to order",
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
              $ref: "#/components/schemas/AssignDriverInput",
            },
          },
        },
      },

      responses: {
        200: {
          description: "Driver assigned successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageResponse",
              },
            },
          },
        },

        400: {
          description: "Invalid order status or driver unavailable",
        },

        404: {
          description: "Restaurant, order or driver not found",
        },
      },
    },
  },

  "/delivery/pickup/{orderId}": {
    patch: {
      tags: ["Delivery"],
      summary: "Driver picks up order",

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
          description: "Order picked up successfully",

          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageResponse",
              },
            },
          },
        },

        400: {
          description: "Only assigned orders can be picked up",
        },

        404: {
          description: "Driver or order not found",
        },
      },
    },
  },

  "/delivery/deliver/{orderId}": {
    patch: {
      tags: ["Delivery"],
      summary: "Deliver order",

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
          description: "Order delivered successfully",

          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageResponse",
              },
            },
          },
        },

        400: {
          description: "Only ON_THE_WAY orders can be delivered",
        },

        404: {
          description: "Driver or order not found",
        },
      },
    },
  },

  "/delivery/cancel/{orderId}": {
    patch: {
      tags: ["Delivery"],
      summary: "Cancel delivery",

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
          description: "Delivery cancelled successfully",

          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageResponse",
              },
            },
          },
        },

        400: {
          description: "Invalid order status",
        },

        404: {
          description: "Driver or order not found",
        },
      },
    },
  },

  "/delivery/my-deliveries": {
    get: {
      tags: ["Delivery"],
      summary: "Get my delivered orders",

      security: [
        {
          bearerAuth: [],
        },
      ],

      responses: {
        200: {
          description: "Delivered orders fetched successfully",

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  orders: {
                    type: "array",

                    items: {
                      type: "object",
                    },
                  },

                  pagination: {
                    type: "object",
                  },
                },
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

  "/delivery/current": {
    get: {
      tags: ["Delivery"],
      summary: "Get current assigned orders",

      security: [
        {
          bearerAuth: [],
        },
      ],

      responses: {
        200: {
          description: "Current orders fetched successfully",

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  orders: {
                    type: "array",

                    items: {
                      type: "object",
                    },
                  },

                  pagination: {
                    type: "object",
                  },
                },
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

  "/delivery/{orderId}": {
    get: {
      tags: ["Delivery"],
      summary: "Get delivery details",

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
          description: "Delivery fetched successfully",

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  order: {
                    type: "object",
                  },
                },
              },
            },
          },
        },

        403: {
          description: "You are not assigned to this order",
        },

        404: {
          description: "Driver or order not found",
        },
      },
    },
  },
};
