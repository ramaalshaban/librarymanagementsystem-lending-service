const { HttpServerError, BadRequestError } = require("common");

const { LoanEvent } = require("models");

const getLoanEventByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const loanEvent = await LoanEvent.findOne({
      ...query,
      isActive: true,
    });

    if (!loanEvent) return null;

    return loanEvent.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingLoanEventByQuery",
      err,
    );
  }
};

module.exports = getLoanEventByQuery;
