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
        enum: ["ACTIVE", "BLOCKED"],
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

  RegisterInput: {
    type: "object",

    required: ["fullName", "email", "password", "phone"],

    properties: {
      fullName: {
        type: "string",
        example: "Essam Alaa",
      },

      email: {
        type: "string",
        format: "email",
        example: "essam@gmail.com",
      },

      password: {
        type: "string",
        format: "password",
        example: "Essam123@",
      },

      phone: {
        type: "string",
        example: "01012345678",
      },
    },
  },

  VerifyEmailInput: {
    type: "object",

    required: ["email", "otp"],

    properties: {
      email: {
        type: "string",
        format: "email",
        example: "essam@gmail.com",
      },

      otp: {
        type: "string",
        example: "123456",
      },
    },
  },

  LoginInput: {
    type: "object",

    required: ["email", "password"],

    properties: {
      email: {
        type: "string",
        format: "email",
        example: "essam@gmail.com",
      },

      password: {
        type: "string",
        format: "password",
        example: "Essam123@",
      },
    },
  },

  AccessTokenResponse: {
    type: "object",

    properties: {
      message: {
        type: "string",
        example: "User logged in successfully",
      },

      accessToken: {
        type: "string",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      },

      user: {
        $ref: "#/components/schemas/User",
      },
    },
  },

  RefreshTokenResponse: {
    type: "object",

    properties: {
      accessToken: {
        type: "string",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      },
    },
  },

  MessageResponse: {
    type: "object",

    properties: {
      message: {
        type: "string",
        example: "Operation completed successfully",
      },
    },
  },

  ErrorResponse: {
    type: "object",

    properties: {
      status: {
        type: "integer",
        example: 400,
      },

      message: {
        type: "string",
        example: "Invalid email or password",
      },

      error: {
        nullable: true,
      },
    },
  },
};
