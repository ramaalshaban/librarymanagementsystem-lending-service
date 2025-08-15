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

const { LoanEvent } = require("models");

const { DBCreateMongooseCommand } = require("dbCommand");

const { LoanEventQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getLoanEventById = require("./utils/getLoanEventById");

class DbCreateLoaneventCommand extends DBCreateMongooseCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateLoanevent";
    this.objectName = "loanEvent";
    this.serviceLabel = "librarymanagementsystem-lending-service";
    this.dbEvent =
      "librarymanagementsystem-lending-service-dbevent-loanevent-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new LoanEventQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "loanEvent",
      this.session,
      this.requestId,
    );
    const dbData = await getLoanEventById(this.dbData.id);
    await elasticIndexer.indexData(dbData);
  }

  // ask about this should i rename the whereClause to dataClause???

  async create_childs() {}

  async transposeResult() {
    // transpose dbData
  }

  async runDbCommand() {
    await super.runDbCommand();

    let loanEvent = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        loanId: this.dataClause.loanId,
      };

      loanEvent = loanEvent || (await LoanEvent.findOne(whereClause));

      if (loanEvent) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" + "loanId",
        );
      }
      whereClause = {
        actorUserId: this.dataClause.actorUserId,
      };

      loanEvent = loanEvent || (await LoanEvent.findOne(whereClause));

      if (loanEvent) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" + "actorUserId",
        );
      }

      if (!updated && this.dataClause.id && !exists) {
        loanEvent = loanEvent || (await LoanEvent.findById(this.dataClause.id));
        if (loanEvent) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await loanEvent.update(this.dataClause);
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
        "Error in checking unique index when creating LoanEvent",
        eDetail,
      );
    }

    if (!updated && !exists) {
      loanEvent = await LoanEvent.create(this.dataClause);
    }

    this.dbData = loanEvent.getData();
    this.input.loanEvent = this.dbData;
    await this.create_childs();
  }
}

const dbCreateLoanevent = async (input) => {
  const dbCreateCommand = new DbCreateLoaneventCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateLoanevent;
