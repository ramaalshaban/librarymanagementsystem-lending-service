const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { LoanEvent } = require("models");
const { ObjectId } = require("mongoose").Types;

const { DBGetMongooseCommand } = require("dbCommand");

class DbGetLoaneventCommand extends DBGetMongooseCommand {
  constructor(input) {
    super(input, LoanEvent);
    this.commandName = "dbGetLoanevent";
    this.nullResult = false;
    this.objectName = "loanEvent";
    this.serviceLabel = "librarymanagementsystem-lending-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (LoanEvent.getCqrsJoins) {
      await LoanEvent.getCqrsJoins(data);
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

const dbGetLoanevent = (input) => {
  input.id = input.loanEventId;
  const dbGetCommand = new DbGetLoaneventCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetLoanevent;
