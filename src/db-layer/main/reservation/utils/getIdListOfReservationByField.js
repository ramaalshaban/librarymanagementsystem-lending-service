const { HttpServerError, BadRequestError, NotFoundError } = require("common");

const { Reservation } = require("models");

const getIdListOfReservationByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    const reservationProperties = [
      "id",
      "userId",
      "bookId",
      "branchId",
      "status",
      "requestedAt",
      "queuePosition",
      "activationNotifiedAt",
      "fulfilledAt",
    ];

    if (!reservationProperties.includes(fieldName)) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    // type validation different from sequelize for mongodb
    const schemaPath = Reservation.schema.paths[fieldName];
    if (schemaPath && fieldValue !== undefined && fieldValue !== null) {
      const expectedType = schemaPath.instance.toLowerCase();
      const actualType = typeof fieldValue;

      const typeMapping = {
        string: "string",
        number: "number",
        boolean: "boolean",
        objectid: "string", // ObjectIds are typically passed as strings
      };

      const expectedJSType = typeMapping[expectedType];
      if (expectedJSType && actualType !== expectedJSType) {
        throw new BadRequestError(
          `Invalid field value type for ${fieldName}. Expected ${expectedJSType}, got ${actualType}.`,
        );
      }
    }

    let query = isArray
      ? {
          [fieldName]: {
            $in: Array.isArray(fieldValue) ? fieldValue : [fieldValue],
          },
        }
      : { [fieldName]: fieldValue };

    query.isActive = true;

    let reservationIdList = await Reservation.find(query, { _id: 1 })
      .lean()
      .exec();

    if (!reservationIdList || reservationIdList.length === 0) {
      throw new NotFoundError(
        `Reservation with the specified criteria not found`,
      );
    }

    reservationIdList = reservationIdList.map((item) => item._id.toString());

    return reservationIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingReservationIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfReservationByField;
