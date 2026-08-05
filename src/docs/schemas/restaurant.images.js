module.exports = {
  RestaurantImage: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      url: {
        type: "string",
        format: "uri",
        example:
          "https://res.cloudinary.com/demo/image/upload/v123456/restaurants/logo.jpg",
      },

      publicId: {
        type: "string",
        example: "restaurants/logo_123456",
      },

      restaurantId: {
        type: "string",
        format: "uuid",
      },

      type: {
        type: "string",
        enum: ["LOGO", "COVER", "GALLERY"],
        example: "LOGO",
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

  RestaurantImageInput: {
    type: "object",

    required: ["url", "publicId", "type"],

    properties: {
      url: {
        type: "string",
        format: "uri",
        example:
          "https://res.cloudinary.com/demo/image/upload/v123456/restaurants/logo.jpg",
      },

      publicId: {
        type: "string",
        example: "restaurants/logo_123456",
      },

      type: {
        type: "string",
        enum: ["LOGO", "COVER", "GALLERY"],
        example: "LOGO",
      },
    },
  },
};
