const { HttpServerError, BadRequestError } = require("common");

const { Loan } = require("models");

const updateLoanByQuery = async (query, dataClause) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    dataClause.updatedAt = new Date();

    const options = { new: true, runValidators: true };

    const result = await Loan.updateMany(
      { ...query, isActive: true },
      dataClause,
      options,
    );

    return { modifiedCount: result.modifiedCount };
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenUpdatingLoanByQuery", err);
  }
};

module.exports = updateLoanByQuery;
