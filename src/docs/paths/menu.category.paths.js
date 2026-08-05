module.exports = {
  "/menu-categories": {
    get: {
      tags: ["Menu Categories"],
      summary: "Get all menu categories",
      responses: {
        200: {
          description: "Menu categories fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  menuCategory: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/MenuCategory",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    post: {
      tags: ["Menu Categories"],
      summary: "Create menu category",
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
              $ref: "#/components/schemas/CreateMenuCategoryInput",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Menu category created successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MenuCategoryMessageResponse",
              },
            },
          },
        },
        404: {
          description: "Restaurant not found",
        },
        409: {
          description: "Menu category already exists",
        },
      },
    },
  },

  "/menu-categories/my": {
    get: {
      tags: ["Menu Categories"],
      summary: "Get my restaurant menu categories",
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
          name: "search",
          schema: {
            type: "string",
            example: "Sandwich",
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
          description: "Menu categories fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MenuCategoriesResponse",
              },
            },
          },
        },
      },
    },
  },

  "/menu-categories/my/{id}": {
    get: {
      tags: ["Menu Categories"],
      summary: "Get my menu category by id",
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
          description: "Menu category fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MenuCategoryResponse",
              },
            },
          },
        },
        404: {
          description: "Menu category not found",
        },
      },
    },
  },

  "/menu-categories/{id}": {
    patch: {
      tags: ["Menu Categories"],
      summary: "Update menu category",
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
              $ref: "#/components/schemas/UpdateMenuCategoryInput",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Menu category updated successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MenuCategoryMessageResponse",
              },
            },
          },
        },
        404: {
          description: "Menu category not found",
        },
        409: {
          description: "Menu category name already exists",
        },
      },
    },

    delete: {
      tags: ["Menu Categories"],
      summary: "Delete menu category",
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
          description: "Menu category deleted successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageResponse",
              },
            },
          },
        },
        400: {
          description: "Category contains products",
        },
        404: {
          description: "Menu category not found",
        },
      },
    },

    get: {
      tags: ["Menu Categories"],
      summary: "Get menu category by id",
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
          description: "Menu category fetched successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MenuCategoryResponse",
              },
            },
          },
        },
        404: {
          description: "Menu category not found",
        },
      },
    },
  },
};
