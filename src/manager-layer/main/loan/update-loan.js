const LoanManager = require("./LoanManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const { LoanUpdatedPublisher } = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbUpdateLoan } = require("dbLayer");

class UpdateLoanManager extends LoanManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateLoan",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "loan";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.loanId = this.loanId;
    jsonObj.status = this.status;
    jsonObj.dueDate = this.dueDate;
    jsonObj.returnedAt = this.returnedAt;
    jsonObj.renewalCount = this.renewalCount;
    jsonObj.renewalHistory = this.renewalHistory;
    jsonObj.lastRenewedAt = this.lastRenewedAt;
  }

  readRestParameters(request) {
    this.loanId = request.params?.loanId;
    this.status = request.body?.status;
    this.dueDate = request.body?.dueDate;
    this.returnedAt = request.body?.returnedAt;
    this.renewalCount = request.body?.renewalCount;
    this.renewalHistory = request.body?.renewalHistory;
    this.lastRenewedAt = request.body?.lastRenewedAt;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.loanId = request.mcpParams.loanId;
    this.status = request.mcpParams.status;
    this.dueDate = request.mcpParams.dueDate;
    this.returnedAt = request.mcpParams.returnedAt;
    this.renewalCount = request.mcpParams.renewalCount;
    this.renewalHistory = request.mcpParams.renewalHistory;
    this.lastRenewedAt = request.mcpParams.lastRenewedAt;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getLoanById } = require("dbLayer");
    this.loan = await getLoanById(this.loanId);
    if (!this.loan) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.loanId == null) {
      throw new BadRequestError("errMsg_loanIdisRequired");
    }

    // ID
    if (
      this.loanId &&
      !isValidObjectId(this.loanId) &&
      !isValidUUID(this.loanId)
    ) {
      throw new BadRequestError("errMsg_loanIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.loan?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbUpdateLoan function to update the loan and return the result to the controller
    const loan = await dbUpdateLoan(this);

    return loan;
  }

  async raiseEvent() {
    LoanUpdatedPublisher.Publish(this.output, this.session).catch((err) => {
      console.log("Publisher Error in Rest Controller:", err);
    });
  }

  async getRouteQuery() {
    return { $and: [{ id: this.loanId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToMongoDbQuery } = require("common");

    const routeQuery = await this.getRouteQuery();
    return convertUserQueryToMongoDbQuery(routeQuery);
  }

  async getDataClause() {
    const { hashString } = require("common");

    const dataClause = {
      status: this.status,
      dueDate: this.dueDate,
      returnedAt: this.returnedAt,
      renewalCount: this.renewalCount,
      renewalHistory: this.renewalHistory
        ? typeof this.renewalHistory == "string"
          ? JSON.parse(this.renewalHistory)
          : this.renewalHistory
        : null,
      lastRenewedAt: this.lastRenewedAt,
    };

    return dataClause;
  }
}

module.exports = UpdateLoanManager;
