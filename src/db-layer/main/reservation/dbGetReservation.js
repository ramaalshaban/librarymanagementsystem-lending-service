const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { Reservation } = require("models");
const { ObjectId } = require("mongoose").Types;

const { DBGetMongooseCommand } = require("dbCommand");

class DbGetReservationCommand extends DBGetMongooseCommand {
  constructor(input) {
    super(input, Reservation);
    this.commandName = "dbGetReservation";
    this.nullResult = false;
    this.objectName = "reservation";
    this.serviceLabel = "librarymanagementsystem-lending-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (Reservation.getCqrsJoins) {
      await Reservation.getCqrsJoins(data);
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

const dbGetReservation = (input) => {
  input.id = input.reservationId;
  const dbGetCommand = new DbGetReservationCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetReservation;
