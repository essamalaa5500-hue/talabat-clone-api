module.exports = {
  ErrorResponse: {
    type: "object",
    properties: {
      status: {
        type: "integer",
        example: 400,
      },
      message: {
        type: "string",
        example: "Validation Error",
      },
      error: {
        type: "object",
        nullable: true,
      },
    },
  },
};
