const { HttpServerError, BadRequestError, NotFoundError } = require("common");
const { LoanEvent } = require("models");

const getLoanEventListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const loanEvent = await LoanEvent.find(query);

    if (!loanEvent || loanEvent.length === 0) return [];

    //should i add not found error or only return empty array?
    //      if (!loanEvent || loanEvent.length === 0) {
    //      throw new NotFoundError(
    //      `LoanEvent with the specified criteria not found`
    //  );
    //}

    return loanEvent.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingLoanEventListByQuery",
      err,
    );
  }
};

module.exports = getLoanEventListByQuery;
