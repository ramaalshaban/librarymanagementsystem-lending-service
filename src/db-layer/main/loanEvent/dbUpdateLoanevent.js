const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { LoanEvent } = require("models");

const { DBUpdateMongooseCommand } = require("dbCommand");

const { LoanEventQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getLoanEventById = require("./utils/getLoanEventById");

class DbUpdateLoaneventCommand extends DBUpdateMongooseCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, LoanEvent, instanceMode);
    this.commandName = "dbUpdateLoanevent";
    this.nullResult = false;
    this.objectName = "loanEvent";
    this.serviceLabel = "librarymanagementsystem-lending-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "librarymanagementsystem-lending-service-dbevent-loanevent-updated";
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

  async setCalculatedFieldsAfterInstance(data) {
    const input = this.input;
  }
}

const dbUpdateLoanevent = async (input) => {
  input.id = input.loanEventId;
  const dbUpdateCommand = new DbUpdateLoaneventCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateLoanevent;
