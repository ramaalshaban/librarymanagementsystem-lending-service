const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { Loan } = require("models");

const { DBUpdateMongooseCommand } = require("dbCommand");

const { LoanQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getLoanById = require("./utils/getLoanById");

class DbUpdateLoanCommand extends DBUpdateMongooseCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, Loan, instanceMode);
    this.commandName = "dbUpdateLoan";
    this.nullResult = false;
    this.objectName = "loan";
    this.serviceLabel = "librarymanagementsystem-lending-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "librarymanagementsystem-lending-service-dbevent-loan-updated";
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
    this.queryCacheInvalidator = new LoanQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "loan",
      this.session,
      this.requestId,
    );
    const dbData = await getLoanById(this.dbData.id);
    await elasticIndexer.indexData(dbData);
  }

  // ask about this should i rename the whereClause to dataClause???

  async setCalculatedFieldsAfterInstance(data) {
    const input = this.input;
  }
}

const dbUpdateLoan = async (input) => {
  input.id = input.loanId;
  const dbUpdateCommand = new DbUpdateLoanCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateLoan;
