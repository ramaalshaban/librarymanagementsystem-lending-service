const { HttpServerError, BadRequestError } = require("common");

const { Loan } = require("models");

const getLoanByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const loan = await Loan.findOne({
      ...query,
      isActive: true,
    });

    if (!loan) return null;

    return loan.getData();
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenRequestingLoanByQuery", err);
  }
};

module.exports = getLoanByQuery;
