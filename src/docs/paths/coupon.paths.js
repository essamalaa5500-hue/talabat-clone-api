module.exports = {
  "/coupons": {
    get: {
      tags: ["Coupons"],
      summary: "Get all coupons",
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
          name: "keyword",
          schema: {
            type: "string",
            example: "SUMMER",
          },
        },
        {
          in: "query",
          name: "sort",
          schema: {
            type: "string",
            example: "createdAt",
          },
        },
      ],
      responses: {
        200: {
          description: "Coupons fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CouponListResponse",
              },
            },
          },
        },
      },
    },

    post: {
      tags: ["Coupons"],
      summary: "Create coupon",
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
              $ref: "#/components/schemas/CreateCouponInput",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Coupon created successfully",
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
                      coupon: {
                        $ref: "#/components/schemas/Coupon",
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
        409: {
          description: "Coupon already exists",
        },
      },
    },
  },

  "/coupons/{id}": {
    get: {
      tags: ["Coupons"],
      summary: "Get coupon by id",
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
          description: "Coupon fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  coupon: {
                    $ref: "#/components/schemas/Coupon",
                  },
                  status: {
                    type: "string",
                    example: "ACTIVE",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Coupon not found",
        },
      },
    },

    patch: {
      tags: ["Coupons"],
      summary: "Update coupon",
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
              $ref: "#/components/schemas/UpdateCouponInput",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Coupon updated successfully",
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
                      coupon: {
                        $ref: "#/components/schemas/Coupon",
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
        },
        404: {
          description: "Coupon not found",
        },
        409: {
          description: "Coupon code already exists",
        },
      },
    },

    delete: {
      tags: ["Coupons"],
      summary: "Delete coupon",
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
          description: "Coupon deleted successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageResponse",
              },
            },
          },
        },
        404: {
          description: "Coupon not found",
        },
      },
    },
  },
};
