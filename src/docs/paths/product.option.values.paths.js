module.exports = {
  "/product-option-values/option/{productOptionId}": {
    get: {
      tags: ["Product Option Values"],
      summary: "Get product option values",
      description: "Get all values for a specific product option.",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "productOptionId",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
          description: "Product Option ID",
        },
      ],
      responses: {
        200: {
          description: "Option values fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  option: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        format: "uuid",
                      },
                      name: {
                        type: "string",
                        example: "Choose Size",
                      },
                    },
                  },
                  total: {
                    type: "integer",
                    example: 2,
                  },
                  values: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/OptionValue",
                    },
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
        404: {
          description: "Product option not found",
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
      tags: ["Product Option Values"],
      summary: "Create product option value",
      description:
        "Create a new choice/value (e.g., Large, Extra Cheese) for a product option.",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "productOptionId",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
          description: "Product Option ID",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CreateOptionValueInput",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Value created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Value created successfully",
                  },
                  value: {
                    $ref: "#/components/schemas/OptionValue",
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
        404: {
          description: "Product option not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        409: {
          description: "Value already exists",
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

  "/product-option-values/option/{productOptionId}/{valueId}": {
    get: {
      tags: ["Product Option Values"],
      summary: "Get product option value by ID",
      description: "Get detailed information about a single option value.",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "productOptionId",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
          description: "Product Option ID",
        },
        {
          in: "path",
          name: "valueId",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
          description: "Option Value ID",
        },
      ],
      responses: {
        200: {
          description: "Option value fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  option: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        format: "uuid",
                      },
                      name: {
                        type: "string",
                        example: "Choose Size",
                      },
                      isRequired: {
                        type: "boolean",
                        example: true,
                      },
                      maxSelections: {
                        type: "integer",
                        example: 1,
                      },
                    },
                  },
                  value: {
                    $ref: "#/components/schemas/OptionValue",
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
        404: {
          description: "Product option or Value not found",
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
      tags: ["Product Option Values"],
      summary: "Update product option value",
      description:
        "Update details of a product option value (e.g., name, extra price).",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "productOptionId",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
          description: "Product Option ID",
        },
        {
          in: "path",
          name: "valueId",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
          description: "Option Value ID",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateOptionValueInput",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Value updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Value updated successfully",
                  },
                  option: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        format: "uuid",
                      },
                    },
                  },
                  value: {
                    $ref: "#/components/schemas/OptionValue",
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
        404: {
          description: "Product option or Value not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        409: {
          description: "Value already exists",
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
      tags: ["Product Option Values"],
      summary: "Delete product option value",
      description: "Soft delete a product option value.",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "productOptionId",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
          description: "Product Option ID",
        },
        {
          in: "path",
          name: "valueId",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
          description: "Option Value ID",
        },
      ],
      responses: {
        200: {
          description: "Value deleted successfully",
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
        404: {
          description: "Product option or Value not found",
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
