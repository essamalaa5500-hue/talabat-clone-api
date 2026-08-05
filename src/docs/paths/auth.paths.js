module.exports = {
  "/auth/register": {
    post: {
      tags: ["Authentication"],
      summary: "Register new user",
      description: "Create a new user account and send email verification OTP.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/RegisterInput",
            },
          },
        },
      },
      responses: {
        201: {
          description: "User registered successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example:
                      "User created successfully. Please verify your email.",
                  },
                  user: {
                    $ref: "#/components/schemas/User",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Validation error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        409: {
          description: "Email or phone already exists",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },

  "/auth/login": {
    post: {
      tags: ["Authentication"],
      summary: "Login",
      description: "Login user and return access token.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/LoginInput",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Login successful",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AccessTokenResponse",
              },
            },
          },
        },
        401: {
          description: "Invalid credentials",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        403: {
          description: "Email not verified",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },

  "/auth/logout": {
    post: {
      tags: ["Authentication"],
      summary: "Logout",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Logout successful",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageResponse",
              },
            },
          },
        },
      },
    },
  },

  "/auth/logoutAll": {
    post: {
      tags: ["Authentication"],
      summary: "Logout from all devices",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Logged out from all devices",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageResponse",
              },
            },
          },
        },
      },
    },
  },

  "/auth/forgotPassword": {
    post: {
      tags: ["Authentication"],
      summary: "Forgot password",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "OTP sent",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageResponse",
              },
            },
          },
        },
      },
    },
  },

  "/auth/resetPassword": {
    post: {
      tags: ["Authentication"],
      summary: "Reset password",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "otp", "newPassword"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                },
                otp: {
                  type: "string",
                  example: "123456",
                },
                newPassword: {
                  type: "string",
                  example: "Essam123@",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Password reset successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageResponse",
              },
            },
          },
        },
      },
    },
  },

  "/auth/changePassword": {
    post: {
      tags: ["Authentication"],
      summary: "Change password",
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["currentPassword", "newPassword"],
              properties: {
                currentPassword: {
                  type: "string",
                },
                newPassword: {
                  type: "string",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Password changed successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageResponse",
              },
            },
          },
        },
      },
    },
  },

  "/auth/refreshToken": {
    post: {
      tags: ["Authentication"],
      summary: "Refresh access token",
      responses: {
        200: {
          description: "New access token",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RefreshTokenResponse",
              },
            },
          },
        },
      },
    },
  },

  "/auth/verifyEmail": {
    post: {
      tags: ["Authentication"],
      summary: "Verify email",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/VerifyEmailInput",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Email verified",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageResponse",
              },
            },
          },
        },
      },
    },
  },

  "/auth/resendVerificationEmail": {
    post: {
      tags: ["Authentication"],
      summary: "Resend verification email",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Verification email sent",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageResponse",
              },
            },
          },
        },
      },
    },
  },
};
