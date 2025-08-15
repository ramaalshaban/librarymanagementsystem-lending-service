const { HttpServerError, BadRequestError } = require("common");

const { LoanEvent } = require("models");

const deleteLoanEventByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }
    // sholuld i match the resul returned with sequlize?

    const docs = await LoanEvent.find({ ...query, isActive: true });
    if (!docs || docs.length === 0) return [];

    await LoanEvent.updateMany(
      { ...query, isActive: true },
      { isActive: false, updatedAt: new Date() },
    );
    return docs.map((doc) => doc.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenDeletingLoanEventByQuery",
      err,
    );
  }
};

module.exports = deleteLoanEventByQuery;
