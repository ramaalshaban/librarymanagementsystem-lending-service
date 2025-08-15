const { HttpServerError } = require("common");

const { LoanEvent } = require("models");

const getLoanEventById = async (loanEventId) => {
  try {
    let loanEvent;

    if (Array.isArray(loanEventId)) {
      loanEvent = await LoanEvent.find({
        _id: { $in: loanEventId },
        isActive: true,
      });
    } else {
      loanEvent = await LoanEvent.findOne({
        _id: loanEventId,
        isActive: true,
      });
    }

    if (!loanEvent) {
      return null;
    }

    return Array.isArray(loanEventId)
      ? loanEvent.map((item) => item.getData())
      : loanEvent.getData();
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenRequestingLoanEventById", err);
  }
};

module.exports = getLoanEventById;
