const { HttpServerError, BadRequestError, newUUID } = require("common");
//should i add the elastic for mongodb?
const { ElasticIndexer } = require("serviceCommon");

const { Loan } = require("models");

const indexDataToElastic = async (data) => {
  const elasticIndexer = new ElasticIndexer("loan");
  await elasticIndexer.indexData(data);
};

const validateData = (data) => {
  const requiredFields = [
    "userId",
    "bookId",
    "branchId",
    "branchInventoryId",
    "status",
    "checkedOutAt",
    "dueDate",
    "renewalCount",
    "checkedOutBy",
    "isActive",
  ];

  requiredFields.forEach((field) => {
    if (data[field] === null || data[field] === undefined) {
      throw new BadRequestError(
        `Field "${field}" is required and cannot be null or undefined.`,
      );
    }
  });

  if (!data._id && !data.id) {
    data._id = newUUID();
  }
};

const createLoan = async (data) => {
  try {
    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestError(`errMsg_invalidInputDataForLoan`);
    }

    validateData(data);

    const newloan = new Loan(data);
    const createdloan = await newloan.save();

    //shoul i use model's getData method for consistency with Sequelize
    const _data = createdloan.getData();

    await indexDataToElastic(_data);

    return _data;
  } catch (err) {
    throw new HttpServerError(`errMsg_dbErrorWhenCreatingLoan`, err);
  }
};

module.exports = createLoan;
