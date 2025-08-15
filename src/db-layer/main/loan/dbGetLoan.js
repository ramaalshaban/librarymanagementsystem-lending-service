const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { Loan } = require("models");
const { ObjectId } = require("mongoose").Types;

const { DBGetMongooseCommand } = require("dbCommand");

class DbGetLoanCommand extends DBGetMongooseCommand {
  constructor(input) {
    super(input, Loan);
    this.commandName = "dbGetLoan";
    this.nullResult = false;
    this.objectName = "loan";
    this.serviceLabel = "librarymanagementsystem-lending-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (Loan.getCqrsJoins) {
      await Loan.getCqrsJoins(data);
    }
  }

  // populateQuery(query) {
  //  if (!this.input.getJoins) return query;
  //
  //  return query;
  //}

  initOwnership(input) {
    super.initOwnership(input);
  }

  async checkEntityOwnership(entity) {
    return true;
  }

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    // transpose dbData
  }
}

const dbGetLoan = (input) => {
  input.id = input.loanId;
  const dbGetCommand = new DbGetLoanCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetLoan;
