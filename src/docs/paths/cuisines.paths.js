module.exports = {
  "/cuisines": {
    get: {
      tags: ["Cuisines"],
      summary: "Get all cuisines",
      description: "Returns all cuisines with pagination.",
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
            example: "Italian",
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
          description: "Cuisines fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CuisinesResponse",
              },
            },
          },
        },
      },
    },

    post: {
      tags: ["Cuisines"],
      summary: "Create cuisine",
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
              $ref: "#/components/schemas/CreateCuisineInput",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Cuisine created successfully",
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
                      cuisine: {
                        $ref: "#/components/schemas/Cuisine",
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
          description: "Cuisine already exists",
        },
      },
    },
  },

  "/cuisines/{id}": {
    get: {
      tags: ["Cuisines"],
      summary: "Get cuisine by id",
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
          description: "Cuisine fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CuisineResponse",
              },
            },
          },
        },
        404: {
          description: "Cuisine not found",
        },
      },
    },

    patch: {
      tags: ["Cuisines"],
      summary: "Update cuisine",
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
              $ref: "#/components/schemas/UpdateCuisineInput",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Cuisine updated successfully",
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
                      cuisine: {
                        $ref: "#/components/schemas/Cuisine",
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
          description: "Cuisine not found",
        },
        409: {
          description: "Cuisine name already exists",
        },
      },
    },

    delete: {
      tags: ["Cuisines"],
      summary: "Delete cuisine",
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
          description: "Cuisine deleted successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageResponse",
              },
            },
          },
        },
        400: {
          description: "Cuisine is used by restaurants",
        },
        404: {
          description: "Cuisine not found",
        },
      },
    },
  },
};
