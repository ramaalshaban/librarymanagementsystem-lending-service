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
const { dbGetLoanevent } = require("dbLayer");

class GetLoanEventManager extends LoanEventManager {
  constructor(request, controllerType) {
    super(request, {
      name: "getLoanEvent",
      controllerType: controllerType,
      pagination: false,
      crudType: "get",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "loanEvent";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.loanEventId = this.loanEventId;
  }

  readRestParameters(request) {
    this.loanEventId = request.params?.loanEventId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.loanEventId = request.mcpParams.loanEventId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

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
    // make an awaited call to the dbGetLoanevent function to get the loanevent and return the result to the controller
    const loanevent = await dbGetLoanevent(this);

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
}

module.exports = GetLoanEventManager;
