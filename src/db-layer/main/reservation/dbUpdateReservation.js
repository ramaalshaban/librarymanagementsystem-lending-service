const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { Reservation } = require("models");

const { DBUpdateMongooseCommand } = require("dbCommand");

const { ReservationQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getReservationById = require("./utils/getReservationById");

class DbUpdateReservationCommand extends DBUpdateMongooseCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, Reservation, instanceMode);
    this.commandName = "dbUpdateReservation";
    this.nullResult = false;
    this.objectName = "reservation";
    this.serviceLabel = "librarymanagementsystem-lending-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "librarymanagementsystem-lending-service-dbevent-reservation-updated";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async transposeResult() {
    // transpose dbData
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
    const dbData = await getReservationById(this.dbData.id);
    await elasticIndexer.indexData(dbData);
  }

  // ask about this should i rename the whereClause to dataClause???

  async setCalculatedFieldsAfterInstance(data) {
    const input = this.input;
  }
}

const dbUpdateReservation = async (input) => {
  input.id = input.reservationId;
  const dbUpdateCommand = new DbUpdateReservationCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateReservation;
