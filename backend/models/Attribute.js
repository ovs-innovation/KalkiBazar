const mongoose = require("mongoose");

const attributeSchema = new mongoose.Schema(
  {
    title: {
      type: Object,
      required: true,
    },
    name: {
      type: Object,
      required: true,
    },
    variants: [
      {
        name: {
          type: Object,
          required: false,
        },
        hexColor: {
          type: String,
          required: false,
          default: null,
          validate: {
            validator: function(v) {
              if (!v) return true; // Allow null/undefined
              return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
            },
            message: props => `${props.value} is not a valid hex color!`
          }
        },
        status: {
          type: String,
          lowercase: true,
          enum: ["show", "hide"],
          default: "show",
        },
      },
    ],
    option: {
      type: String,
      enum: ["Dropdown", "Radio", "Checkbox"],
    },
    type: {
      type: String,
      lowercase: true,
      default: "attribute",
      enum: ["attribute", "extra"],
    },
    status: {
      type: String,
      lowercase: true,
      enum: ["show", "hide"],
      default: "show",
    },
  },
  {
    timestamps: true,
  }
);

// module.exports = attributeSchema;

const Attribute = mongoose.model("Attribute", attributeSchema);

module.exports = Attribute;
