const { HttpServerError } = require("common");

const { Loan } = require("models");

const getLoanAggById = async (loanId) => {
  try {
    let loanQuery;

    if (Array.isArray(loanId)) {
      loanQuery = Loan.find({
        _id: { $in: loanId },
        isActive: true,
      });
    } else {
      loanQuery = Loan.findOne({
        _id: loanId,
        isActive: true,
      });
    }

    // Populate associations as needed

    const loan = await loanQuery.exec();

    if (!loan) {
      return null;
    }
    const loanData =
      Array.isArray(loanId) && loanId.length > 0
        ? loan.map((item) => item.getData())
        : loan.getData();

    // should i add this here?
    await Loan.getCqrsJoins(loanData);

    return loanData;
  } catch (err) {
    console.log(err);
    throw new HttpServerError("errMsg_dbErrorWhenRequestingLoanAggById", err);
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

module.exports = getLoanAggById;
