const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
// do i need to add the referring part or does the mongodb use the things differently
// is there specific approch to handle the referential integrity or it done interrenly
const { Reservation } = require("models");
const { ObjectId } = require("mongoose").Types;

const { ReservationQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteMongooseCommand } = require("dbCommand");

class DbDeleteReservationCommand extends DBSoftDeleteMongooseCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, Reservation, instanceMode);
    this.commandName = "dbDeleteReservation";
    this.nullResult = false;
    this.objectName = "reservation";
    this.serviceLabel = "librarymanagementsystem-lending-service";
    this.dbEvent =
      "librarymanagementsystem-lending-service" +
      "-dbevent-" +
      "reservation-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new ReservationQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "reservation",
      this.session,
      this.requestId,
    );
    await elasticIndexer.deleteData(this.dbData.id);
  }

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    // transpose dbData
  }
}

const dbDeleteReservation = async (input) => {
  input.id = input.reservationId;
  const dbDeleteCommand = new DbDeleteReservationCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteReservation;
