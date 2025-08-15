const LoanManager = require("./LoanManager");
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
const { dbDeleteLoan } = require("dbLayer");

class DeleteLoanManager extends LoanManager {
  constructor(request, controllerType) {
    super(request, {
      name: "deleteLoan",
      controllerType: controllerType,
      pagination: false,
      crudType: "delete",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "loan";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.loanId = this.loanId;
  }

  readRestParameters(request) {
    this.loanId = request.params?.loanId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.loanId = request.mcpParams.loanId;
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
    // make an awaited call to the dbDeleteLoan function to delete the loan and return the result to the controller
    const loan = await dbDeleteLoan(this);

    return loan;
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
}

module.exports = DeleteLoanManager;
