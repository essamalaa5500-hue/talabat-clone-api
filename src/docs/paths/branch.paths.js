module.exports = {
  "/branches": {
    get: {
      tags: ["Branches"],
      summary: "Get all active branches",
      description: "Returns all active branches with pagination.",
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
            example: "Nasr",
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
          description: "Branches fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/BranchesResponse",
              },
            },
          },
        },
      },
    },

    post: {
      tags: ["Branches"],
      summary: "Create branch",
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
              $ref: "#/components/schemas/CreateBranchInput",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Branch created successfully",
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
                      branch: {
                        $ref: "#/components/schemas/Branch",
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
        403: {
          description: "Restaurant not active",
        },
        409: {
          description: "Phone or branch already exists",
        },
      },
    },
  },

  "/branches/{id}": {
    get: {
      tags: ["Branches"],
      summary: "Get branch by id",
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
          description: "Branch fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/BranchResponse",
              },
            },
          },
        },
        404: {
          description: "Branch not found",
        },
      },
    },

    patch: {
      tags: ["Branches"],
      summary: "Update branch",
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
              $ref: "#/components/schemas/UpdateBranchInput",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Branch updated successfully",
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
                      branch: {
                        $ref: "#/components/schemas/Branch",
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
        403: {
          description: "Unauthorized",
        },
        404: {
          description: "Branch not found",
        },
        409: {
          description: "Phone or branch name already exists",
        },
      },
    },

    delete: {
      tags: ["Branches"],
      summary: "Delete branch",
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
          description: "Branch deleted successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageResponse",
              },
            },
          },
        },
        400: {
          description: "Branch has active orders",
        },
        404: {
          description: "Branch not found",
        },
      },
    },
  },

  "/branches/{id}/status": {
    patch: {
      tags: ["Branches"],
      summary: "Update branch status",
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
              $ref: "#/components/schemas/UpdateBranchStatusInput",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Branch status updated successfully",
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
                      branch: {
                        $ref: "#/components/schemas/Branch",
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        400: {
          description: "Restaurant inactive or same status",
        },
        404: {
          description: "Branch not found",
        },
      },
    },
  },

  "/branches/my": {
    get: {
      tags: ["Branches"],
      summary: "Get my branches",
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
          },
        },
      ],
      responses: {
        200: {
          description: "Branches fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/BranchesResponse",
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

  "/branches/my/{id}": {
    get: {
      tags: ["Branches"],
      summary: "Get my branch by id",
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
          description: "Branch fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/BranchResponse",
              },
            },
          },
        },
        404: {
          description: "Branch not found",
        },
      },
    },
  },

  "/branches/admin": {
    get: {
      tags: ["Branches"],
      summary: "Get all branches (Admin)",
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
          },
        },
        {
          in: "query",
          name: "status",
          schema: {
            type: "string",
            enum: ["ACTIVE", "INACTIVE"],
          },
        },
      ],
      responses: {
        200: {
          description: "Branches fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/BranchesResponse",
              },
            },
          },
        },
        401: {
          description: "Unauthorized",
        },
        403: {
          description: "Forbidden",
        },
      },
    },
  },

  "/branches/admin/{id}": {
    get: {
      tags: ["Branches"],
      summary: "Get branch by id (Admin)",
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
          description: "Branch fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/BranchResponse",
              },
            },
          },
        },
        404: {
          description: "Branch not found",
        },
      },
    },
  },
};
