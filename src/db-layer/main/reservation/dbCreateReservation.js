// exsik olan :
//if exits update and if not exits create
//if index.onDuplicate == "throwError" throw error
//

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { Reservation } = require("models");

const { DBCreateMongooseCommand } = require("dbCommand");

const { ReservationQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getReservationById = require("./utils/getReservationById");

class DbCreateReservationCommand extends DBCreateMongooseCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateReservation";
    this.objectName = "reservation";
    this.serviceLabel = "librarymanagementsystem-lending-service";
    this.dbEvent =
      "librarymanagementsystem-lending-service-dbevent-reservation-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
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

  async create_childs() {}

  async transposeResult() {
    // transpose dbData
  }

  async runDbCommand() {
    await super.runDbCommand();

    let reservation = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        bookId: this.dataClause.bookId,
        branchId: this.dataClause.branchId,
        status: this.dataClause.status,
      };

      reservation = reservation || (await Reservation.findOne(whereClause));

      if (reservation) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" + "bookId-branchId-status",
        );
      }
      whereClause = {
        userId: this.dataClause.userId,
        status: this.dataClause.status,
      };

      reservation = reservation || (await Reservation.findOne(whereClause));

      if (reservation) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" + "userId-status",
        );
      }

      if (!updated && this.dataClause.id && !exists) {
        reservation =
          reservation || (await Reservation.findById(this.dataClause.id));
        if (reservation) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await reservation.update(this.dataClause);
          updated = true;
        }
      }
    } catch (error) {
      const eDetail = {
        dataClause: this.dataClause,
        errorStack: error.stack,
        checkoutResult: this.input.checkoutResult,
      };
      throw new HttpServerError(
        "Error in checking unique index when creating Reservation",
        eDetail,
      );
    }

    if (!updated && !exists) {
      reservation = await Reservation.create(this.dataClause);
    }

    this.dbData = reservation.getData();
    this.input.reservation = this.dbData;
    await this.create_childs();
  }
}

const dbCreateReservation = async (input) => {
  const dbCreateCommand = new DbCreateReservationCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateReservation;
