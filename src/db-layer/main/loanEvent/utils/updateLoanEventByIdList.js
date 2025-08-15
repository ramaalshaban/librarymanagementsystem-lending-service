const { HttpServerError } = require("common");

const { LoanEvent } = require("models");

const updateLoanEventByIdList = async (idList, dataClause) => {
  try {
    await LoanEvent.updateMany(
      { _id: { $in: idList }, isActive: true },
      dataClause,
    );

    const updatedDocs = await LoanEvent.find(
      { _id: { $in: idList }, isActive: true },
      { _id: 1 },
    );

    const loanEventIdList = updatedDocs.map((doc) => doc._id);

    return loanEventIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingLoanEventByIdList",
      err,
    );
  }
};

module.exports = updateLoanEventByIdList;
