module.exports = {
  "/drivers/me": {
    get: {
      tags: ["Drivers"],
      summary: "Get my driver profile",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Driver profile fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DriverProfileResponse",
              },
            },
          },
        },
        404: {
          description: "Driver not found",
        },
      },
    },

    patch: {
      tags: ["Drivers"],
      summary: "Update my driver profile",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateMyDriverProfileInput",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Profile updated successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DriverResponse",
              },
            },
          },
        },
        400: {
          description: "Invalid data",
        },
        404: {
          description: "User not found",
        },
      },
    },
  },

  "/drivers/me/status": {
    patch: {
      tags: ["Drivers"],
      summary: "Change driver availability status",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ChangeDriverStatusInput",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Driver status updated successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DriverResponse",
              },
            },
          },
        },
        400: {
          description: "Invalid status",
        },
        403: {
          description: "Only drivers can change this status",
        },
        404: {
          description: "User not found",
        },
      },
    },
  },

  "/drivers": {
    get: {
      tags: ["Drivers"],
      summary: "Get all available drivers (Admin)",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "query",
          name: "page",
          schema: {
            type: "integer",
            example: 1,
          },
        },
        {
          in: "query",
          name: "limit",
          schema: {
            type: "integer",
            example: 10,
          },
        },
        {
          in: "query",
          name: "status",
          schema: {
            type: "string",
            enum: ["AVAILABLE", "BUSY", "OFFLINE", "SUSPENDED"],
          },
        },
        {
          in: "query",
          name: "vehicleType",
          schema: {
            type: "string",
            enum: ["BIKE", "CAR", "VAN"],
          },
        },
        {
          in: "query",
          name: "sort",
          schema: {
            type: "string",
            example: "-createdAt",
          },
        },
      ],
      responses: {
        200: {
          description: "Drivers fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DriverListResponse",
              },
            },
          },
        },
      },
    },
  },

  "/drivers/{id}": {
    get: {
      tags: ["Drivers"],
      summary: "Get driver by id",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      responses: {
        200: {
          description: "Driver fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DriverProfileResponse",
              },
            },
          },
        },
        404: {
          description: "Driver not found",
        },
      },
    },

    patch: {
      tags: ["Drivers"],
      summary: "Update driver (Admin)",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
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
              $ref: "#/components/schemas/UpdateDriverInput",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Driver updated successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DriverResponse",
              },
            },
          },
        },
        400: {
          description: "Invalid data",
        },
        404: {
          description: "Driver not found",
        },
        409: {
          description: "Duplicate data (phone, license, plate, national id...)",
        },
      },
    },

    delete: {
      tags: ["Drivers"],
      summary: "Delete driver (Soft Delete)",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      responses: {
        200: {
          description: "Driver deleted successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageResponse",
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
};
