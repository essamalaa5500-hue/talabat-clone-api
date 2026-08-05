module.exports = {
  "/orders": {
    post: {
      tags: ["Orders"],
      summary: "Create new order",
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
              $ref: "#/components/schemas/CreateOrderInput",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Order created successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  {
                    $ref: "#/components/schemas/MessageResponse",
                  },
                  {
                    type: "object",
                    properties: {
                      order: {
                        $ref: "#/components/schemas/Order",
                      },
                    },
                  },
                ],
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
        401: {
          description: "Unauthorized",
        },
      },
    },
  },

  "/orders/my-orders": {
    get: {
      tags: ["Orders"],
      summary: "Get my orders",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Orders fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  orders: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Order",
                    },
                  },
                  pagination: {
                    $ref: "#/components/schemas/Pagination",
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  "/orders/{id}": {
    get: {
      tags: ["Orders"],
      summary: "Get order by id",
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
        },
      ],
      responses: {
        200: {
          description: "Order fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Order",
              },
            },
          },
        },
        404: {
          description: "Order not found",
        },
      },
    },
  },

  "/orders/{id}/cancel": {
    patch: {
      tags: ["Orders"],
      summary: "Cancel order",
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
        },
      ],
      responses: {
        200: {
          description: "Order cancelled successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageResponse",
              },
            },
          },
        },
        404: {
          description: "Order not found",
        },
      },
    },
  },

  "/orders/restaurant/orders": {
    get: {
      tags: ["Orders"],
      summary: "Get restaurant orders",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Restaurant orders fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  orders: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Order",
                    },
                  },
                  pagination: {
                    $ref: "#/components/schemas/Pagination",
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  "/orders/{id}/accept": {
    patch: {
      tags: ["Orders"],
      summary: "Accept order",
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
        },
      ],
      responses: {
        200: {
          description: "Order accepted successfully",
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

  "/orders/{id}/reject": {
    patch: {
      tags: ["Orders"],
      summary: "Reject order",
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
        },
      ],
      responses: {
        200: {
          description: "Order rejected successfully",
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

  "/orders/{id}/preparing": {
    patch: {
      tags: ["Orders"],
      summary: "Mark order as preparing",
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
        },
      ],
      responses: {
        200: {
          description: "Order status updated successfully",
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

  "/orders/{id}/ready": {
    patch: {
      tags: ["Orders"],
      summary: "Mark order as ready",
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
        },
      ],
      responses: {
        200: {
          description: "Order is ready",
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

  "/orders/{id}/assign-driver": {
    patch: {
      tags: ["Orders"],
      summary: "Assign driver to order",
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
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/AssignDriverInput",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Driver assigned successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageResponse",
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
  },

  "/orders/{id}/pick-up": {
    patch: {
      tags: ["Orders"],
      summary: "Driver picks up order",
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
        },
      ],
      responses: {
        200: {
          description: "Order picked up successfully",
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

  "/orders/{id}/delivered": {
    patch: {
      tags: ["Orders"],
      summary: "Driver delivers order",
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
        },
      ],
      responses: {
        200: {
          description: "Order delivered successfully",
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
