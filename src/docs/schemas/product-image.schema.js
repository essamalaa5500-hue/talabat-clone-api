module.exports = {
  ProductImage: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      productId: {
        type: "string",
        format: "uuid",
      },

      url: {
        type: "string",
        format: "uri",
        example:
          "https://res.cloudinary.com/demo/image/upload/v123456/products/burger.jpg",
      },

      publicId: {
        type: "string",
        example: "talabat/products/abc123xyz",
      },

      type: {
        type: "string",
        enum: ["MAIN", "GALLERY"],
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

  UploadProductImageInput: {
    type: "object",

    required: ["image"],

    properties: {
      image: {
        type: "string",
        format: "binary",
      },
    },
  },

  SetMainProductImageResponse: {
    type: "object",

    properties: {
      message: {
        type: "string",
        example: "Main image updated successfully",
      },

      image: {
        $ref: "#/components/schemas/ProductImage",
      },
    },
  },
};
