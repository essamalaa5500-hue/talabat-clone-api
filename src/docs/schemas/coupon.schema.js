module.exports = {
  Coupon: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      code: {
        type: "string",
        example: "SUMMER20",
      },

      type: {
        type: "string",
        enum: ["FIXED", "PERCENTAGE"],
      },

      value: {
        type: "number",
        format: "double",
        example: 20,
      },

      minimumOrderAmount: {
        type: "number",
        format: "double",
        example: 150,
      },

      maximumDiscount: {
        type: "number",
        format: "double",
        nullable: true,
        example: 100,
      },

      usageLimit: {
        type: "integer",
        example: 500,
      },

      usedCount: {
        type: "integer",
        example: 15,
      },

      startsAt: {
        type: "string",
        format: "date-time",
      },

      expiresAt: {
        type: "string",
        format: "date-time",
      },

      isActive: {
        type: "boolean",
        example: true,
      },

      name: {
        type: "string",
        nullable: true,
        example: "Summer Offer",
      },

      description: {
        type: "string",
        nullable: true,
        example: "20% discount on all orders.",
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

  CouponUsage: {
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

      couponId: {
        type: "string",
        format: "uuid",
      },

      orderId: {
        type: "string",
        format: "uuid",
      },

      usedAt: {
        type: "string",
        format: "date-time",
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

  CreateCouponInput: {
    type: "object",

    required: [
      "code",
      "type",
      "value",
      "minimumOrderAmount",
      "usageLimit",
      "startsAt",
      "expiresAt",
    ],

    properties: {
      code: {
        type: "string",
        example: "SUMMER20",
      },

      type: {
        type: "string",
        enum: ["FIXED", "PERCENTAGE"],
      },

      value: {
        type: "number",
        format: "double",
        example: 20,
      },

      minimumOrderAmount: {
        type: "number",
        format: "double",
        example: 150,
      },

      maximumDiscount: {
        type: "number",
        format: "double",
        nullable: true,
        example: 100,
      },

      usageLimit: {
        type: "integer",
        example: 500,
      },

      startsAt: {
        type: "string",
        format: "date-time",
        example: "2026-08-01T00:00:00Z",
      },

      expiresAt: {
        type: "string",
        format: "date-time",
        example: "2026-09-01T00:00:00Z",
      },

      name: {
        type: "string",
        nullable: true,
        example: "Summer Offer",
      },

      description: {
        type: "string",
        nullable: true,
        example: "20% discount on all orders.",
      },
    },
  },

  UpdateCouponInput: {
    type: "object",

    properties: {
      code: {
        type: "string",
        example: "SUMMER30",
      },

      type: {
        type: "string",
        enum: ["FIXED", "PERCENTAGE"],
      },

      value: {
        type: "number",
        format: "double",
        example: 30,
      },

      minimumOrderAmount: {
        type: "number",
        format: "double",
        example: 200,
      },

      maximumDiscount: {
        type: "number",
        format: "double",
        nullable: true,
        example: 120,
      },

      usageLimit: {
        type: "integer",
        example: 1000,
      },

      startsAt: {
        type: "string",
        format: "date-time",
      },

      expiresAt: {
        type: "string",
        format: "date-time",
      },

      isActive: {
        type: "boolean",
      },

      name: {
        type: "string",
      },

      description: {
        type: "string",
      },
    },
  },

  CouponListResponse: {
    type: "object",

    properties: {
      coupons: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Coupon",
        },
      },

      pagination: {
        type: "object",

        properties: {
          page: {
            type: "integer",
          },

          limit: {
            type: "integer",
          },

          total: {
            type: "integer",
          },

          totalPages: {
            type: "integer",
          },
        },
      },
    },
  },
};
