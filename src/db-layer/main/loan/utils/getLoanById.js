const { HttpServerError } = require("common");

const { Loan } = require("models");

const getLoanById = async (loanId) => {
  try {
    let loan;

    if (Array.isArray(loanId)) {
      loan = await Loan.find({
        _id: { $in: loanId },
        isActive: true,
      });
    } else {
      loan = await Loan.findOne({
        _id: loanId,
        isActive: true,
      });
    }

    if (!loan) {
      return null;
    }

    return Array.isArray(loanId)
      ? loan.map((item) => item.getData())
      : loan.getData();
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenRequestingLoanById", err);
  }
};

module.exports = getLoanById;
