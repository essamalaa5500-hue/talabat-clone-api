module.exports = {
  Order: {
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

      branchId: {
        type: "string",
        format: "uuid",
      },

      driverId: {
        type: "string",
        format: "uuid",
        nullable: true,
      },

      couponId: {
        type: "string",
        format: "uuid",
        nullable: true,
      },

      status: {
        type: "string",
        enum: [
          "PENDING",
          "CONFIRMED",
          "PREPARING",
          "READY",
          "ASSIGNED",
          "ON_THE_WAY",
          "DELIVERED",
          "CANCELLED",
          "REJECTED",
        ],
      },

      subtotal: {
        type: "number",
        example: 250,
      },

      deliveryFee: {
        type: "number",
        example: 25,
      },

      discount: {
        type: "number",
        example: 20,
      },

      tax: {
        type: "number",
        example: 14,
      },

      totalAmount: {
        type: "number",
        example: 269,
      },

      notes: {
        type: "string",
        nullable: true,
      },

      orderAddress: {
        $ref: "#/components/schemas/OrderAddress",
      },

      orderStatusHistory: {
        type: "array",
        items: {
          $ref: "#/components/schemas/OrderStatusHistory",
        },
      },

      items: {
        type: "array",
        items: {
          $ref: "#/components/schemas/OrderItem",
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

  OrderItem: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      productVariantId: {
        type: "string",
        format: "uuid",
      },

      productName: {
        type: "string",
        example: "Chicken Burger",
      },

      variantName: {
        type: "string",
        example: "Large",
      },

      quantity: {
        type: "integer",
        example: 2,
      },

      unitPrice: {
        type: "number",
        example: 120,
      },

      totalPrice: {
        type: "number",
        example: 240,
      },

      discount: {
        type: "number",
        example: 20,
      },

      notes: {
        type: "string",
        nullable: true,
      },

      options: {
        type: "array",
        items: {
          $ref: "#/components/schemas/OrderItemOption",
        },
      },
    },
  },

  OrderItemOption: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      optionName: {
        type: "string",
        example: "Extra Cheese",
      },

      extraPrice: {
        type: "number",
        example: 20,
      },
    },
  },

  OrderAddress: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      city: {
        type: "string",
      },

      area: {
        type: "string",
      },

      street: {
        type: "string",
      },

      building: {
        type: "string",
      },

      floor: {
        type: "string",
      },

      apartment: {
        type: "string",
      },

      latitude: {
        type: "number",
      },

      longitude: {
        type: "number",
      },

      notes: {
        type: "string",
        nullable: true,
      },
    },
  },

  OrderStatusHistory: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      status: {
        type: "string",
      },

      changedById: {
        type: "string",
        format: "uuid",
        nullable: true,
      },

      createdAt: {
        type: "string",
        format: "date-time",
      },
    },
  },

  CreateOrderInput: {
    type: "object",

    properties: {
      addressId: {
        type: "string",
        format: "uuid",
      },

      notes: {
        type: "string",
        example: "Please call me before delivery",
      },
    },

    required: ["addressId"],
  },

  AssignDriverInput: {
    type: "object",

    properties: {
      driverId: {
        type: "string",
        format: "uuid",
      },
    },

    required: ["driverId"],
  },
};
