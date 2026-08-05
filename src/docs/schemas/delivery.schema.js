module.exports = {
  Delivery: {
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

      driverId: {
        type: "string",
        format: "uuid",
        nullable: true,
      },

      status: {
        type: "string",
        enum: ["PENDING", "ASSIGNED", "ON_THE_WAY", "DELIVERED", "CANCELLED"],
      },

      assignedAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },

      pickedUpAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },

      deliveredAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },

      canceledAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },

      history: {
        type: "array",
        items: {
          $ref: "#/components/schemas/DeliveryStatusHistory",
        },
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

  DeliveryStatusHistory: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      deliveryId: {
        type: "string",
        format: "uuid",
      },

      status: {
        type: "string",
        enum: ["PENDING", "ASSIGNED", "ON_THE_WAY", "DELIVERED", "CANCELLED"],
      },

      changedById: {
        type: "string",
        format: "uuid",
        nullable: true,
      },

      notes: {
        type: "string",
        nullable: true,
      },

      createdAt: {
        type: "string",
        format: "date-time",
      },
    },
  },

  AssignDriverInput: {
    type: "object",

    required: ["userId"],

    properties: {
      userId: {
        type: "string",
        format: "uuid",
      },
    },
  },
};
