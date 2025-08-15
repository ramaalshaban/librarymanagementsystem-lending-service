const LoanManager = require("./LoanManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const { LoanCreatedPublisher } = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbCreateLoan } = require("dbLayer");

class CreateLoanManager extends LoanManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createLoan",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "loan";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.userId = this.userId;
    jsonObj.bookId = this.bookId;
    jsonObj.branchId = this.branchId;
    jsonObj.branchInventoryId = this.branchInventoryId;
    jsonObj.status = this.status;
    jsonObj.checkedOutAt = this.checkedOutAt;
    jsonObj.dueDate = this.dueDate;
    jsonObj.returnedAt = this.returnedAt;
    jsonObj.renewalCount = this.renewalCount;
    jsonObj.renewalHistory = this.renewalHistory;
    jsonObj.lastRenewedAt = this.lastRenewedAt;
    jsonObj.checkedOutBy = this.checkedOutBy;
  }

  readRestParameters(request) {
    this.userId = request.body?.userId;
    this.bookId = request.body?.bookId;
    this.branchId = request.body?.branchId;
    this.branchInventoryId = request.body?.branchInventoryId;
    this.status = request.body?.status;
    this.checkedOutAt = request.body?.checkedOutAt;
    this.dueDate = request.body?.dueDate;
    this.returnedAt = request.body?.returnedAt;
    this.renewalCount = request.body?.renewalCount;
    this.renewalHistory = request.body?.renewalHistory;
    this.lastRenewedAt = request.body?.lastRenewedAt;
    this.checkedOutBy = request.body?.checkedOutBy;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.userId = request.mcpParams.userId;
    this.bookId = request.mcpParams.bookId;
    this.branchId = request.mcpParams.branchId;
    this.branchInventoryId = request.mcpParams.branchInventoryId;
    this.status = request.mcpParams.status;
    this.checkedOutAt = request.mcpParams.checkedOutAt;
    this.dueDate = request.mcpParams.dueDate;
    this.returnedAt = request.mcpParams.returnedAt;
    this.renewalCount = request.mcpParams.renewalCount;
    this.renewalHistory = request.mcpParams.renewalHistory;
    this.lastRenewedAt = request.mcpParams.lastRenewedAt;
    this.checkedOutBy = request.mcpParams.checkedOutBy;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.userId == null) {
      throw new BadRequestError("errMsg_userIdisRequired");
    }

    if (this.bookId == null) {
      throw new BadRequestError("errMsg_bookIdisRequired");
    }

    if (this.branchId == null) {
      throw new BadRequestError("errMsg_branchIdisRequired");
    }

    if (this.branchInventoryId == null) {
      throw new BadRequestError("errMsg_branchInventoryIdisRequired");
    }

    if (this.status == null) {
      throw new BadRequestError("errMsg_statusisRequired");
    }

    if (this.checkedOutAt == null) {
      throw new BadRequestError("errMsg_checkedOutAtisRequired");
    }

    if (this.dueDate == null) {
      throw new BadRequestError("errMsg_dueDateisRequired");
    }

    if (this.renewalCount == null) {
      throw new BadRequestError("errMsg_renewalCountisRequired");
    }

    if (this.checkedOutBy == null) {
      throw new BadRequestError("errMsg_checkedOutByisRequired");
    }

    // ID
    if (
      this.userId &&
      !isValidObjectId(this.userId) &&
      !isValidUUID(this.userId)
    ) {
      throw new BadRequestError("errMsg_userIdisNotAValidID");
    }

    // ID
    if (
      this.bookId &&
      !isValidObjectId(this.bookId) &&
      !isValidUUID(this.bookId)
    ) {
      throw new BadRequestError("errMsg_bookIdisNotAValidID");
    }

    // ID
    if (
      this.branchId &&
      !isValidObjectId(this.branchId) &&
      !isValidUUID(this.branchId)
    ) {
      throw new BadRequestError("errMsg_branchIdisNotAValidID");
    }

    // ID
    if (
      this.branchInventoryId &&
      !isValidObjectId(this.branchInventoryId) &&
      !isValidUUID(this.branchInventoryId)
    ) {
      throw new BadRequestError("errMsg_branchInventoryIdisNotAValidID");
    }

    // ID
    if (
      this.checkedOutBy &&
      !isValidObjectId(this.checkedOutBy) &&
      !isValidUUID(this.checkedOutBy)
    ) {
      throw new BadRequestError("errMsg_checkedOutByisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.loan?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateLoan function to create the loan and return the result to the controller
    const loan = await dbCreateLoan(this);

    return loan;
  }

  async raiseEvent() {
    LoanCreatedPublisher.Publish(this.output, this.session).catch((err) => {
      console.log("Publisher Error in Rest Controller:", err);
    });
  }

  async getDataClause() {
    const { newObjectId } = require("common");

    const { hashString } = require("common");

    if (this.id) this.loanId = this.id;
    if (!this.loanId) this.loanId = newObjectId();

    const dataClause = {
      _id: this.loanId,
      userId: this.userId,
      bookId: this.bookId,
      branchId: this.branchId,
      branchInventoryId: this.branchInventoryId,
      status: this.status,
      checkedOutAt: this.checkedOutAt,
      dueDate: this.dueDate,
      returnedAt: this.returnedAt,
      renewalCount: this.renewalCount,
      renewalHistory: this.renewalHistory
        ? typeof this.renewalHistory == "string"
          ? JSON.parse(this.renewalHistory)
          : this.renewalHistory
        : null,
      lastRenewedAt: this.lastRenewedAt,
      checkedOutBy: this.checkedOutBy,
    };

    return dataClause;
  }
}

module.exports = CreateLoanManager;
