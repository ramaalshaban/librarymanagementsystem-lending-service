const LoanEventManager = require("./LoanEventManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbUpdateLoanevent } = require("dbLayer");

class UpdateLoanEventManager extends LoanEventManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateLoanEvent",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "loanEvent";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.loanEventId = this.loanEventId;
    jsonObj.note = this.note;
  }

  readRestParameters(request) {
    this.loanEventId = request.params?.loanEventId;
    this.note = request.body?.note;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.loanEventId = request.mcpParams.loanEventId;
    this.note = request.mcpParams.note;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getLoanEventById } = require("dbLayer");
    this.loanEvent = await getLoanEventById(this.loanEventId);
    if (!this.loanEvent) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.loanEventId == null) {
      throw new BadRequestError("errMsg_loanEventIdisRequired");
    }

    // ID
    if (
      this.loanEventId &&
      !isValidObjectId(this.loanEventId) &&
      !isValidUUID(this.loanEventId)
    ) {
      throw new BadRequestError("errMsg_loanEventIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.loanEvent?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbUpdateLoanevent function to update the loanevent and return the result to the controller
    const loanevent = await dbUpdateLoanevent(this);

    return loanevent;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.loanEventId }, { isActive: true }] };

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
      note: this.note,
    };

    return dataClause;
  }
}

module.exports = UpdateLoanEventManager;
