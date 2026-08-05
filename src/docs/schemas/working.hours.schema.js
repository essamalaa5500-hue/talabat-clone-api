module.exports = {
  WorkingHour: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
      },

      branchId: {
        type: "string",
        format: "uuid",
      },

      dayOfWeek: {
        type: "string",
        enum: [
          "SUNDAY",
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THURSDAY",
          "FRIDAY",
          "SATURDAY",
        ],
        example: "MONDAY",
      },

      startTime: {
        type: "string",
        example: "09:00",
      },

      endTime: {
        type: "string",
        example: "23:00",
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

  WorkingHourInput: {
    type: "object",

    required: ["dayOfWeek", "startTime", "endTime"],

    properties: {
      dayOfWeek: {
        type: "string",
        enum: [
          "SUNDAY",
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THURSDAY",
          "FRIDAY",
          "SATURDAY",
        ],
        example: "MONDAY",
      },

      startTime: {
        type: "string",
        example: "09:00",
      },

      endTime: {
        type: "string",
        example: "23:00",
      },
    },
  },
};
