const { mongoose } = require("common");
const { Schema } = mongoose;
const loaneventSchema = new mongoose.Schema(
  {
    loanId: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
      defaultValue: "checkout",
    },
    eventDate: {
      type: Date,
      required: true,
    },
    actorUserId: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: false,
    },
    isActive: {
      // isActive property will be set to false when deleted
      // so that the document will be archived
      type: Boolean,
      default: true,
      required: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
      },
    },
  },
);

loaneventSchema.set("versionKey", "recordVersion");
loaneventSchema.set("timestamps", true);

loaneventSchema.set("toObject", { virtuals: true });
loaneventSchema.set("toJSON", { virtuals: true });

module.exports = loaneventSchema;
