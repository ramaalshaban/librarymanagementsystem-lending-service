const { HttpServerError, BadRequestError, NotFoundError } = require("common");

const { LoanEvent } = require("models");

const getIdListOfLoanEventByField = async (fieldName, fieldValue, isArray) => {
  try {
    const loanEventProperties = [
      "id",
      "loanId",
      "eventType",
      "eventDate",
      "actorUserId",
      "note",
    ];

    if (!loanEventProperties.includes(fieldName)) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    // type validation different from sequelize for mongodb
    const schemaPath = LoanEvent.schema.paths[fieldName];
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

    let loanEventIdList = await LoanEvent.find(query, { _id: 1 }).lean().exec();

    if (!loanEventIdList || loanEventIdList.length === 0) {
      throw new NotFoundError(
        `LoanEvent with the specified criteria not found`,
      );
    }

    loanEventIdList = loanEventIdList.map((item) => item._id.toString());

    return loanEventIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingLoanEventIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfLoanEventByField;
