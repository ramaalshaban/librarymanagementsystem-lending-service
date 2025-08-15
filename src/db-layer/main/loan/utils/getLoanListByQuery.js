const { HttpServerError, BadRequestError, NotFoundError } = require("common");
const { Loan } = require("models");

const getLoanListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const loan = await Loan.find(query);

    if (!loan || loan.length === 0) return [];

    //should i add not found error or only return empty array?
    //      if (!loan || loan.length === 0) {
    //      throw new NotFoundError(
    //      `Loan with the specified criteria not found`
    //  );
    //}

    return loan.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingLoanListByQuery",
      err,
    );
  }
};

module.exports = getLoanListByQuery;
