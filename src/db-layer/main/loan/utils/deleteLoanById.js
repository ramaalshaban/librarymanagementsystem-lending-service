const { HttpServerError, BadRequestError, NotFoundError } = require("common");
const { Loan } = require("models");
const { ElasticIndexer } = require("serviceCommon");

const indexDataToElastic = async (id) => {
  const elasticIndexer = new ElasticIndexer("loan");
  await elasticIndexer.deleteData(id);
};

const deleteLoanById = async (id) => {
  try {
    if (typeof id === "object") {
      id = id.id;
    }
    if (!id)
      throw new BadRequestError("ID is required in utility delete function");

    const existingDoc = await Loan.findOne({
      _id: id,
      isActive: true,
    });

    if (!existingDoc) {
      throw new NotFoundError(`Record with ID ${id} not found.`);
    }

    const options = { new: true };
    const dataClause = { isActive: false };

    const deletedDoc = await Loan.findOneAndUpdate(
      { _id: id, isActive: true },
      dataClause,
      options,
    );

    await indexDataToElastic(id);

    return deletedDoc.getData();
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw err;
    }
    throw new HttpServerError("errMsg_dbErrorWhenUpdatingLoanById", err);
  }
};

module.exports = deleteLoanById;
