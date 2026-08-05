module.exports = {
  User: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },
      fullName: {
        type: "string",
        example: "Essam Alaa",
      },
      email: {
        type: "string",
        format: "email",
        example: "essam@gmail.com",
      },
      phone: {
        type: "string",
        example: "01012345678",
      },
      avatar: {
        type: "string",
        nullable: true,
        example: "https://res.cloudinary.com/demo/image/upload/avatar.png",
      },
      status: {
        type: "string",
        enum: ["ACTIVE", "SUSPENDED", "BANNED"],
        example: "ACTIVE",
      },
      role: {
        type: "string",
        enum: ["CUSTOMER", "RESTAURANT_OWNER", "DRIVER", "ADMIN"],
        example: "CUSTOMER",
      },
      isEmailVerified: {
        type: "boolean",
        example: true,
      },
      emailVerifiedAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },
      phoneVerifiedAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },
      lastLoginAt: {
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

  UpdateMyProfileInput: {
    type: "object",
    properties: {
      fullName: {
        type: "string",
        example: "Essam Alaa",
      },
      phone: {
        type: "string",
        example: "01012345678",
      },
      avatar: {
        type: "string",
        example: "https://res.cloudinary.com/demo/image/upload/avatar.png",
      },
    },
  },

  UpdateUserInput: {
    type: "object",
    properties: {
      role: {
        type: "string",
        enum: ["CUSTOMER", "RESTAURANT_OWNER", "DRIVER", "ADMIN"],
        example: "ADMIN",
      },
      status: {
        type: "string",
        enum: ["ACTIVE", "SUSPENDED", "BANNED"],
        example: "SUSPENDED",
      },
    },
  },

  UsersResponse: {
    type: "object",
    properties: {
      users: {
        type: "array",
        items: {
          $ref: "#/components/schemas/User",
        },
      },
      pagination: {
        type: "object",
        properties: {
          page: { type: "integer", example: 1 },
          limit: { type: "integer", example: 10 },
          total: { type: "integer", example: 50 },
          totalPages: { type: "integer", example: 5 },
        },
      },
    },
  },

  UserResponse: {
    type: "object",
    properties: {
      message: {
        type: "string",
        example: "User retrieved successfully",
      },
      user: {
        $ref: "#/components/schemas/User",
      },
    },
  },
};
