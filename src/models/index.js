const { mongoose } = require("common");
const { getEnumValue } = require("serviceCommon");
const { ElasticIndexer } = require("serviceCommon");
const updateElasticIndexMappings = require("./elastic-index");

const loanSchema = require("./loan");

const reservationSchema = require("./reservation");

const loaneventSchema = require("./loanEvent");

loanSchema.methods.getCqrsJoins = async function (data) {};

loanSchema.methods.getData = function () {
  let ret = {};
  ret.id = this._doc._id.toString();
  const docProps = Object.keys(this._doc).filter((key) => key != "_id");
  // copy all props from doc
  docProps.forEach((propName) => (ret[propName] = this._doc[propName]));

  const statusOptions = ["active", "returned", "overdue", "lost", "canceled"];
  if (ret.status != null) {
    const enumIndex =
      typeof ret.status === "string"
        ? statusOptions.indexOf(ret.status)
        : ret.status;
    ret.status_idx = enumIndex;
    ret.status = enumIndex > -1 ? statusOptions[enumIndex] : undefined;
  }

  return ret;
};

reservationSchema.methods.getCqrsJoins = async function (data) {};

reservationSchema.methods.getData = function () {
  let ret = {};
  ret.id = this._doc._id.toString();
  const docProps = Object.keys(this._doc).filter((key) => key != "_id");
  // copy all props from doc
  docProps.forEach((propName) => (ret[propName] = this._doc[propName]));

  const statusOptions = [
    "active",
    "waiting",
    "fulfilled",
    "canceled",
    "expired",
    "noShow",
  ];
  if (ret.status != null) {
    const enumIndex =
      typeof ret.status === "string"
        ? statusOptions.indexOf(ret.status)
        : ret.status;
    ret.status_idx = enumIndex;
    ret.status = enumIndex > -1 ? statusOptions[enumIndex] : undefined;
  }

  return ret;
};

loaneventSchema.methods.getCqrsJoins = async function (data) {};

loaneventSchema.methods.getData = function () {
  let ret = {};
  ret.id = this._doc._id.toString();
  const docProps = Object.keys(this._doc).filter((key) => key != "_id");
  // copy all props from doc
  docProps.forEach((propName) => (ret[propName] = this._doc[propName]));

  const eventTypeOptions = [
    "checkout",
    "return",
    "renewal",
    "overdue",
    "reservationFulfilled",
    "cancellation",
    "lost",
  ];
  if (ret.eventType != null) {
    const enumIndex =
      typeof ret.eventType === "string"
        ? eventTypeOptions.indexOf(ret.eventType)
        : ret.eventType;
    ret.eventType_idx = enumIndex;
    ret.eventType = enumIndex > -1 ? eventTypeOptions[enumIndex] : undefined;
  }

  return ret;
};

const Loan = mongoose.model("Loan", loanSchema);
const Reservation = mongoose.model("Reservation", reservationSchema);
const LoanEvent = mongoose.model("LoanEvent", loaneventSchema);

module.exports = {
  Loan,
  Reservation,
  LoanEvent,
  updateElasticIndexMappings,
};
