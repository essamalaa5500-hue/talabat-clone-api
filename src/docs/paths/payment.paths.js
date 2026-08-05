module.exports = {
  "/payments/{orderId}": {
    post: {
      tags: ["Payments"],
      summary: "Create payment for order",
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
              $ref: "#/components/schemas/CreatePaymentInput",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Payment created successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  {
                    $ref: "#/components/schemas/MessageResponse",
                  },
                  {
                    type: "object",
                    properties: {
                      payment: {
                        $ref: "#/components/schemas/Payment",
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        400: {
          description: "Validation error or payment already exists",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Order not found",
        },
      },
    },
  },

  "/payments/{paymentId}": {
    get: {
      tags: ["Payments"],
      summary: "Get payment by id",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "paymentId",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      responses: {
        200: {
          description: "Payment fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  payment: {
                    $ref: "#/components/schemas/Payment",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Payment not found",
        },
      },
    },
  },

  "/payments/order/{orderId}": {
    get: {
      tags: ["Payments"],
      summary: "Get payment by order id",
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
          description: "Payment fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  payment: {
                    $ref: "#/components/schemas/Payment",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Payment not found",
        },
      },
    },
  },

  "/payments/{paymentId}/status": {
    patch: {
      tags: ["Payments"],
      summary: "Update payment status",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "paymentId",
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
              $ref: "#/components/schemas/UpdatePaymentStatusInput",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Payment status updated successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageResponse",
              },
            },
          },
        },
        400: {
          description: "Validation error or invalid status transition",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Payment not found",
        },
      },
    },
  },
};
