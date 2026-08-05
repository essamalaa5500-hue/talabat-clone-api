module.exports = {
  "/users": {
    get: {
      tags: ["Users"],
      summary: "Get all users (Admin only)",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "query",
          name: "page",
          schema: { type: "integer", default: 1 },
          description: "Page number",
        },
        {
          in: "query",
          name: "limit",
          schema: { type: "integer", default: 10 },
          description: "Number of items per page",
        },
        {
          in: "query",
          name: "search",
          schema: { type: "string" },
          description: "Search in fullName, email, or phone",
        },
        {
          in: "query",
          name: "sort",
          schema: { type: "string" },
          description: "Field to sort by (createdAt, fullName, email, phone)",
        },
        {
          in: "query",
          name: "order",
          schema: { type: "string", enum: ["asc", "desc"] },
          description: "Sort order",
        },
        {
          in: "query",
          name: "role",
          schema: {
            type: "string",
            enum: ["CUSTOMER", "RESTAURANT_OWNER", "DRIVER", "ADMIN"],
          },
          description: "Filter by user role",
        },
        {
          in: "query",
          name: "isEmailVerified",
          schema: { type: "boolean" },
          description: "Filter by email verification status",
        },
      ],
      responses: {
        200: {
          description: "Users retrieved successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UsersResponse" },
            },
          },
        },
        400: { description: "Invalid query parameters" },
        401: { description: "Unauthorized" },
        403: { description: "Forbidden - Admin access required" },
      },
    },
  },

  "/users/me": {
    get: {
      tags: ["Users"],
      summary: "Get current logged-in user profile",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Profile retrieved successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserResponse" },
            },
          },
        },
        401: { description: "Unauthorized" },
        404: { description: "User not found" },
      },
    },

    patch: {
      tags: ["Users"],
      summary: "Update current logged-in user profile",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateMyProfileInput" },
          },
        },
      },
      responses: {
        200: {
          description: "Profile updated successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserResponse" },
            },
          },
        },
        400: { description: "Invalid input or no data provided" },
        401: { description: "Unauthorized" },
        409: { description: "Phone number already exists" },
      },
    },

    delete: {
      tags: ["Users"],
      summary: "Soft delete current logged-in user account",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Account deleted successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Account deleted successfully",
                  },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
        404: { description: "User not found" },
      },
    },
  },

  "/users/{id}": {
    get: {
      tags: ["Users"],
      summary: "Get user by ID (Admin only)",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "User ID",
        },
      ],
      responses: {
        200: {
          description: "User retrieved successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserResponse" },
            },
          },
        },
        400: { description: "Invalid ID parameter" },
        401: { description: "Unauthorized" },
        403: { description: "Forbidden - Admin access required" },
        404: { description: "User not found" },
      },
    },

    patch: {
      tags: ["Users"],
      summary: "Update user role or status by ID (Admin only)",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "User ID",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateUserInput" },
          },
        },
      },
      responses: {
        200: {
          description: "User updated successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserResponse" },
            },
          },
        },
        400: { description: "Invalid input or no data provided" },
        401: { description: "Unauthorized" },
        403: { description: "Forbidden - Admin access required" },
        404: { description: "User not found" },
      },
    },
  },
};
