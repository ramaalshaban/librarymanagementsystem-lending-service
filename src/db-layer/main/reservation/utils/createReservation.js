const { HttpServerError, BadRequestError, newUUID } = require("common");
//should i add the elastic for mongodb?
const { ElasticIndexer } = require("serviceCommon");

const { Reservation } = require("models");

const indexDataToElastic = async (data) => {
  const elasticIndexer = new ElasticIndexer("reservation");
  await elasticIndexer.indexData(data);
};

const validateData = (data) => {
  const requiredFields = [
    "userId",
    "bookId",
    "branchId",
    "status",
    "requestedAt",
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

const createReservation = async (data) => {
  try {
    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestError(`errMsg_invalidInputDataForReservation`);
    }

    validateData(data);

    const newreservation = new Reservation(data);
    const createdreservation = await newreservation.save();

    //shoul i use model's getData method for consistency with Sequelize
    const _data = createdreservation.getData();

    await indexDataToElastic(_data);

    return _data;
  } catch (err) {
    throw new HttpServerError(`errMsg_dbErrorWhenCreatingReservation`, err);
  }
};

module.exports = createReservation;
