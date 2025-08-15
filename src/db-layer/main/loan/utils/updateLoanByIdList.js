const { HttpServerError } = require("common");

const { Loan } = require("models");

const updateLoanByIdList = async (idList, dataClause) => {
  try {
    await Loan.updateMany({ _id: { $in: idList }, isActive: true }, dataClause);

    const updatedDocs = await Loan.find(
      { _id: { $in: idList }, isActive: true },
      { _id: 1 },
    );

    const loanIdList = updatedDocs.map((doc) => doc._id);

    return loanIdList;
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenUpdatingLoanByIdList", err);
  }
};

module.exports = updateLoanByIdList;
