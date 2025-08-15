const { HttpServerError, BadRequestError, NotFoundError } = require("common");

const { Loan } = require("models");

const getIdListOfLoanByField = async (fieldName, fieldValue, isArray) => {
  try {
    const loanProperties = [
      "id",
      "userId",
      "bookId",
      "branchId",
      "branchInventoryId",
      "status",
      "checkedOutAt",
      "dueDate",
      "returnedAt",
      "renewalCount",
      "renewalHistory",
      "lastRenewedAt",
      "checkedOutBy",
    ];

    if (!loanProperties.includes(fieldName)) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    // type validation different from sequelize for mongodb
    const schemaPath = Loan.schema.paths[fieldName];
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

    let loanIdList = await Loan.find(query, { _id: 1 }).lean().exec();

    if (!loanIdList || loanIdList.length === 0) {
      throw new NotFoundError(`Loan with the specified criteria not found`);
    }

    loanIdList = loanIdList.map((item) => item._id.toString());

    return loanIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingLoanIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfLoanByField;
