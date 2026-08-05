module.exports = {
  "/restaurants": {
    get: {
      tags: ["Restaurants"],
      summary: "Get all active restaurants",
      description:
        "Retrieve a paginated list of active restaurants with optional search, sorting, and filtering.",
      parameters: [
        {
          in: "query",
          name: "page",
          schema: {
            type: "integer",
            minimum: 1,
            default: 1,
          },
          description: "Page number for pagination",
        },
        {
          in: "query",
          name: "limit",
          schema: {
            type: "integer",
            minimum: 1,
            maximum: 100,
            default: 10,
          },
          description: "Number of items per page",
        },
        {
          in: "query",
          name: "search",
          schema: {
            type: "string",
            maxLength: 100,
          },
          description: "Search by restaurant name or description",
        },
        {
          in: "query",
          name: "sort",
          schema: {
            type: "string",
            enum: [
              "createdAt",
              "-createdAt",
              "name",
              "-name",
              "status",
              "-status",
            ],
          },
          description: "Field to sort by (prefix with '-' for descending)",
        },
        {
          in: "query",
          name: "status",
          schema: {
            type: "string",
            enum: ["PENDING", "ACTIVE", "INACTIVE", "REJECTED"],
          },
          description: "Filter by restaurant status",
        },
      ],
      responses: {
        200: {
          description: "Restaurants fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RestaurantsPaginationResponse",
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
      },
    },

    post: {
      tags: ["Restaurants"],
      summary: "Create a restaurant",
      description:
        "Submit a new restaurant creation request (Restaurant Owner only). Status defaults to PENDING.",
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
              $ref: "#/components/schemas/CreateRestaurantInput",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Restaurant created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Restaurant created successfully",
                  },
                  restaurant: {
                    $ref: "#/components/schemas/Restaurant",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Validation error or invalid cuisine ID(s)",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        403: {
          description: "Forbidden (Requires RESTAURANT_OWNER role)",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        409: {
          description: "Restaurant name already exists",
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

  "/restaurants/admin": {
    get: {
      tags: ["Restaurants"],
      summary: "Get all restaurants (Admin)",
      description:
        "Retrieve a paginated list of all restaurants regardless of status (Admin only).",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "query",
          name: "page",
          schema: {
            type: "integer",
            minimum: 1,
          },
        },
        {
          in: "query",
          name: "limit",
          schema: {
            type: "integer",
            minimum: 1,
            maximum: 100,
          },
        },
        {
          in: "query",
          name: "search",
          schema: {
            type: "string",
            minLength: 1,
            maxLength: 100,
          },
        },
        {
          in: "query",
          name: "sort",
          schema: {
            type: "string",
            enum: [
              "createdAt",
              "-createdAt",
              "name",
              "-name",
              "status",
              "-status",
            ],
          },
        },
        {
          in: "query",
          name: "status",
          schema: {
            type: "string",
            enum: ["PENDING", "ACTIVE", "INACTIVE", "REJECTED"],
          },
        },
      ],
      responses: {
        200: {
          description: "Restaurants fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RestaurantsPaginationResponse",
              },
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        403: {
          description: "Forbidden (Requires ADMIN role)",
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

  "/restaurants/my": {
    get: {
      tags: ["Restaurants"],
      summary: "Get current user's restaurants",
      description:
        "Retrieve all restaurants owned by the currently authenticated user (Restaurant Owner only).",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Owner's restaurants fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RestaurantsResponse",
              },
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        403: {
          description: "Forbidden (Requires RESTAURANT_OWNER role)",
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

  "/restaurants/admin/{id}": {
    get: {
      tags: ["Restaurants"],
      summary: "Get restaurant details by ID (Admin)",
      description:
        "Retrieve any non-deleted restaurant details regardless of status (Admin only).",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
          description: "Restaurant ID",
        },
      ],
      responses: {
        200: {
          description: "Restaurant details fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RestaurantResponse",
              },
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        403: {
          description: "Forbidden (Requires ADMIN role)",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Restaurant not found",
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

  "/restaurants/{id}": {
    get: {
      tags: ["Restaurants"],
      summary: "Get active restaurant by ID",
      description: "Retrieve details of an active restaurant.",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
          description: "Restaurant ID",
        },
      ],
      responses: {
        200: {
          description: "Restaurant fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RestaurantResponse",
              },
            },
          },
        },
        404: {
          description: "Restaurant not found or inactive",
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

    patch: {
      tags: ["Restaurants"],
      summary: "Update restaurant info",
      description:
        "Update restaurant name or description (Restaurant Owner only).",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
          description: "Restaurant ID",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateRestaurantInput",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Restaurant updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Restaurant Updated successfully",
                  },
                  restaurant: {
                    $ref: "#/components/schemas/Restaurant",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Validation error or no data provided",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        403: {
          description: "Forbidden (Requires RESTAURANT_OWNER role)",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Restaurant not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        409: {
          description: "Restaurant name already exists",
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

    delete: {
      tags: ["Restaurants"],
      summary: "Delete restaurant",
      description:
        "Soft delete a restaurant and its related branches (Admin only).",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
          description: "Restaurant ID",
        },
      ],
      responses: {
        201: {
          description: "Restaurant deleted successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Restaurant Deleted successfully",
                  },
                  restaurant: {
                    $ref: "#/components/schemas/Restaurant",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        403: {
          description: "Forbidden (Requires ADMIN role)",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Restaurant not found",
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

  "/restaurants/{id}/status": {
    patch: {
      tags: ["Restaurants"],
      summary: "Update restaurant status",
      description:
        "Change the status of a restaurant (PENDING, ACTIVE, INACTIVE, REJECTED) (Admin only).",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
          description: "Restaurant ID",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateRestaurantStatusInput",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Status updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Restaurant status Updated successfully",
                  },
                  restaurant: {
                    $ref: "#/components/schemas/Restaurant",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Validation error or restaurant already has this status",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        403: {
          description: "Forbidden (Requires ADMIN role)",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Restaurant not found",
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
};
