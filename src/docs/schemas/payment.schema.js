module.exports = {
  Payment: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      orderId: {
        type: "string",
        format: "uuid",
      },

      paymentMethod: {
        type: "string",
        enum: ["CASH", "CARD", "WALLET"],
      },

      amount: {
        type: "number",
        format: "double",
        example: 350,
      },

      status: {
        type: "string",
        enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      },

      transactionId: {
        type: "string",
        nullable: true,
        example: "e0c8d8d0-4b65-4b34-b9d7-1a2c3d4e5f6a",
      },

      currency: {
        type: "string",
        example: "EGP",
      },

      paidAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },

      order: {
        $ref: "#/components/schemas/Order",
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

  CreatePaymentInput: {
    type: "object",

    required: ["paymentMethod"],

    properties: {
      paymentMethod: {
        type: "string",
        enum: ["CASH", "CARD", "WALLET"],
        example: "CARD",
      },
    },
  },

  UpdatePaymentStatusInput: {
    type: "object",

    required: ["status"],

    properties: {
      status: {
        type: "string",
        enum: ["PAID", "FAILED", "REFUNDED"],
        example: "PAID",
      },
    },
  },
};
