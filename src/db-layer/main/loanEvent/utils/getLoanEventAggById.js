const { HttpServerError } = require("common");

const { LoanEvent } = require("models");

const getLoanEventAggById = async (loanEventId) => {
  try {
    let loanEventQuery;

    if (Array.isArray(loanEventId)) {
      loanEventQuery = LoanEvent.find({
        _id: { $in: loanEventId },
        isActive: true,
      });
    } else {
      loanEventQuery = LoanEvent.findOne({
        _id: loanEventId,
        isActive: true,
      });
    }

    // Populate associations as needed

    const loanEvent = await loanEventQuery.exec();

    if (!loanEvent) {
      return null;
    }
    const loanEventData =
      Array.isArray(loanEventId) && loanEventId.length > 0
        ? loanEvent.map((item) => item.getData())
        : loanEvent.getData();

    // should i add this here?
    await LoanEvent.getCqrsJoins(loanEventData);

    return loanEventData;
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingLoanEventAggById",
      err,
    );
  }
};

// "__PropertyEnumSettings.doc": "Enum configuration for the data property, applicable when the property type is set to Enum. While enum values are stored as integers in the database, defining the enum options here allows Mindbricks to enrich API responses with human-readable labels, easing interpretation and UI integration. If not defined, only the numeric value will be returned.",
// "PropertyEnumSettings": {
//   "__hasEnumOptions.doc": "Enables support for named enum values when the property type is Enum. Though values are stored as integers, enabling this adds the symbolic name to API responses for clarity.",
//   "__config.doc": "The configuration object for enum options. Leave it null if hasEnumOptions is false.",
//   "__activation": "hasEnumOptions",
//  "__lines": "\
//  a-hasEnumOptions\
//  g-config",
//  "hasEnumOptions": "Boolean",
//  "config": "PropertyEnumSettingsConfig"
//},

module.exports = getLoanEventAggById;
