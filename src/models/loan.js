const { mongoose } = require("common");
const { Schema } = mongoose;
const loanSchema = new mongoose.Schema(
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
    branchInventoryId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      defaultValue: "active",
    },
    checkedOutAt: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnedAt: {
      type: Date,
      required: false,
    },
    renewalCount: {
      type: Number,
      required: true,
      defaultValue: 0,
    },
    renewalHistory: {
      type: [Schema.Types.Mixed],
      required: false,
      defaultValue: "[]",
    },
    lastRenewedAt: {
      type: Date,
      required: false,
    },
    checkedOutBy: {
      type: String,
      required: true,
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

loanSchema.set("versionKey", "recordVersion");
loanSchema.set("timestamps", true);

loanSchema.set("toObject", { virtuals: true });
loanSchema.set("toJSON", { virtuals: true });

module.exports = loanSchema;
