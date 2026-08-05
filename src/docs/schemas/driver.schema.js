module.exports = {
  Driver: {
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

      nationalId: {
        type: "string",
        example: "29801011234567",
      },

      licenseNumber: {
        type: "string",
        example: "DL-123456",
      },

      vehicleType: {
        type: "string",
        enum: ["BIKE", "CAR", "VAN"],
        example: "CAR",
      },

      vehiclePlateNumber: {
        type: "string",
        example: "ABC-1234",
      },

      status: {
        type: "string",
        enum: ["OFFLINE", "AVAILABLE", "BUSY", "SUSPENDED"],
        example: "AVAILABLE",
      },

      rating: {
        type: "number",
        format: "decimal",
        example: 4.8,
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

  DriverProfile: {
    allOf: [
      {
        $ref: "#/components/schemas/Driver",
      },
      {
        type: "object",

        properties: {
          user: {
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
              },

              phone: {
                type: "string",
                example: "01012345678",
              },

              avatar: {
                type: "string",
                nullable: true,
                example: "https://example.com/avatar.jpg",
              },
            },
          },

          _count: {
            type: "object",

            properties: {
              deliveries: {
                type: "integer",
                example: 120,
              },

              driverReviews: {
                type: "integer",
                example: 50,
              },
            },
          },
        },
      },
    ],
  },

  DriverDetails: {
    allOf: [
      {
        $ref: "#/components/schemas/Driver",
      },
      {
        type: "object",

        properties: {
          user: {
            type: "object",

            properties: {
              id: {
                type: "string",
                format: "uuid",
              },

              fullName: {
                type: "string",
              },

              email: {
                type: "string",
                format: "email",
              },

              phone: {
                type: "string",
              },

              avatar: {
                type: "string",
                nullable: true,
              },

              status: {
                type: "string",
              },

              role: {
                type: "string",
                example: "DRIVER",
              },

              isEmailVerified: {
                type: "boolean",
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
        },
      },
    ],
  },

  UpdateMyDriverProfileInput: {
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
        format: "uri",
      },
    },
  },

  ChangeDriverStatusInput: {
    type: "object",

    required: ["status"],

    properties: {
      status: {
        type: "string",
        enum: ["ONLINE", "OFFLINE"],
        example: "ONLINE",
      },
    },
  },

  UpdateDriverInput: {
    type: "object",

    properties: {
      fullName: {
        type: "string",
      },

      phone: {
        type: "string",
      },

      avatar: {
        type: "string",
        format: "uri",
      },

      nationalId: {
        type: "string",
      },

      licenseNumber: {
        type: "string",
      },

      vehicleType: {
        type: "string",
        enum: ["BIKE", "CAR", "VAN"],
      },

      vehiclePlateNumber: {
        type: "string",
      },

      status: {
        type: "string",
        enum: ["OFFLINE", "AVAILABLE", "BUSY", "SUSPENDED"],
      },
    },
  },

  DriverResponse: {
    type: "object",

    properties: {
      message: {
        type: "string",
        example: "Driver updated successfully",
      },

      driver: {
        $ref: "#/components/schemas/DriverDetails",
      },
    },
  },

  DriverProfileResponse: {
    type: "object",

    properties: {
      driver: {
        $ref: "#/components/schemas/DriverProfile",
      },
    },
  },

  DriverListResponse: {
    type: "object",

    properties: {
      drivers: {
        type: "array",

        items: {
          $ref: "#/components/schemas/DriverDetails",
        },
      },

      pagination: {
        $ref: "#/components/schemas/Pagination",
      },
    },
  },
};
