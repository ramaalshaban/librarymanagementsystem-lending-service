const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
// do i need to add the referring part or does the mongodb use the things differently
// is there specific approch to handle the referential integrity or it done interrenly
const { Loan } = require("models");
const { ObjectId } = require("mongoose").Types;

const {
  getIdListOfLoanEventByField,
  updateLoanEventById,
  deleteLoanEventById,
} = require("../loanEvent");

const { LoanQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteMongooseCommand } = require("dbCommand");

class DbDeleteLoanCommand extends DBSoftDeleteMongooseCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, Loan, instanceMode);
    this.commandName = "dbDeleteLoan";
    this.nullResult = false;
    this.objectName = "loan";
    this.serviceLabel = "librarymanagementsystem-lending-service";
    this.dbEvent =
      "librarymanagementsystem-lending-service" + "-dbevent-" + "loan-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
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
    await elasticIndexer.deleteData(this.dbData.id);
  }

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    // transpose dbData
  }

  async syncJoins() {
    const promises = [];
    const dataId = this.dbData.id;
    // relationTargetKey should be used instead of id
    try {
      // delete refrring objects

      // update referring objects

      // delete childs
      const idList_LoanEvent_loanId_eventLoan =
        await getIdListOfLoanEventByField("loanId", this.dbData.id, false);
      for (const itemId of idList_LoanEvent_loanId_eventLoan) {
        promises.push(deleteLoanEventById(itemId));
      }

      // update childs

      // delete & update parents ???

      // delete and update referred parents

      const results = await Promise.allSettled(promises);
      for (const result of results) {
        if (result instanceof Error) {
          console.log(
            "Single Error when synching delete of Loan on joined and parent objects:",
            dataId,
            result,
          );
          hexaLogger.insertError(
            "SyncJoinError",
            { function: "syncJoins", dataId: dataId },
            "->syncJoins",
            result,
          );
        }
      }
    } catch (err) {
      console.log(
        "Total Error when synching delete of Loan on joined and parent objects:",
        dataId,
        err,
      );
      hexaLogger.insertError(
        "SyncJoinsTotalError",
        { function: "syncJoins", dataId: dataId },
        "->syncJoins",
        err,
      );
    }
  }
}

const dbDeleteLoan = async (input) => {
  input.id = input.loanId;
  const dbDeleteCommand = new DbDeleteLoanCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteLoan;
