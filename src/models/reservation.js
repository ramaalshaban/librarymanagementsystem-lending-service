const { mongoose } = require("common");
const { Schema } = mongoose;
const reservationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    bookId: {
      type: String,
      required: true,
    },
    branchId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      defaultValue: "active",
    },
    requestedAt: {
      type: Date,
      required: true,
    },
    queuePosition: {
      type: Number,
      required: false,
      defaultValue: 1,
    },
    activationNotifiedAt: {
      type: Date,
      required: false,
    },
    fulfilledAt: {
      type: Date,
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

reservationSchema.set("versionKey", "recordVersion");
reservationSchema.set("timestamps", true);

reservationSchema.set("toObject", { virtuals: true });
reservationSchema.set("toJSON", { virtuals: true });

module.exports = reservationSchema;
