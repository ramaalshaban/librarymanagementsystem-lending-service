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

const { Loan } = require("models");

const { DBCreateMongooseCommand } = require("dbCommand");

const { LoanQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getLoanById = require("./utils/getLoanById");

class DbCreateLoanCommand extends DBCreateMongooseCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateLoan";
    this.objectName = "loan";
    this.serviceLabel = "librarymanagementsystem-lending-service";
    this.dbEvent =
      "librarymanagementsystem-lending-service-dbevent-loan-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
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

  async create_childs() {}

  async transposeResult() {
    // transpose dbData
  }

  async runDbCommand() {
    await super.runDbCommand();

    let loan = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        userId: this.dataClause.userId,
        status: this.dataClause.status,
      };

      loan = loan || (await Loan.findOne(whereClause));

      if (loan) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" + "userId-status",
        );
      }
      whereClause = {
        bookId: this.dataClause.bookId,
        branchId: this.dataClause.branchId,
        status: this.dataClause.status,
      };

      loan = loan || (await Loan.findOne(whereClause));

      if (loan) {
        throw new BadRequestError(
          "errMsg_DuplicateIndexErrorWithFields:" + "bookId-branchId-status",
        );
      }

      if (!updated && this.dataClause.id && !exists) {
        loan = loan || (await Loan.findById(this.dataClause.id));
        if (loan) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await loan.update(this.dataClause);
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
        "Error in checking unique index when creating Loan",
        eDetail,
      );
    }

    if (!updated && !exists) {
      loan = await Loan.create(this.dataClause);
    }

    this.dbData = loan.getData();
    this.input.loan = this.dbData;
    await this.create_childs();
  }
}

const dbCreateLoan = async (input) => {
  const dbCreateCommand = new DbCreateLoanCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateLoan;
