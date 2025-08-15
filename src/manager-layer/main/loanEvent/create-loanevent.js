const LoanEventManager = require("./LoanEventManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const { LoaneventCreatedPublisher } = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbCreateLoanevent } = require("dbLayer");

class CreateLoanEventManager extends LoanEventManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createLoanEvent",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "loanEvent";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.loanId = this.loanId;
    jsonObj.eventType = this.eventType;
    jsonObj.eventDate = this.eventDate;
    jsonObj.actorUserId = this.actorUserId;
    jsonObj.note = this.note;
  }

  readRestParameters(request) {
    this.loanId = request.body?.loanId;
    this.eventType = request.body?.eventType;
    this.eventDate = request.body?.eventDate;
    this.actorUserId = request.body?.actorUserId;
    this.note = request.body?.note;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.loanId = request.mcpParams.loanId;
    this.eventType = request.mcpParams.eventType;
    this.eventDate = request.mcpParams.eventDate;
    this.actorUserId = request.mcpParams.actorUserId;
    this.note = request.mcpParams.note;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.loanId == null) {
      throw new BadRequestError("errMsg_loanIdisRequired");
    }

    if (this.eventType == null) {
      throw new BadRequestError("errMsg_eventTypeisRequired");
    }

    if (this.eventDate == null) {
      throw new BadRequestError("errMsg_eventDateisRequired");
    }

    if (this.actorUserId == null) {
      throw new BadRequestError("errMsg_actorUserIdisRequired");
    }

    // ID
    if (
      this.loanId &&
      !isValidObjectId(this.loanId) &&
      !isValidUUID(this.loanId)
    ) {
      throw new BadRequestError("errMsg_loanIdisNotAValidID");
    }

    // ID
    if (
      this.actorUserId &&
      !isValidObjectId(this.actorUserId) &&
      !isValidUUID(this.actorUserId)
    ) {
      throw new BadRequestError("errMsg_actorUserIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.loanEvent?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateLoanevent function to create the loanevent and return the result to the controller
    const loanevent = await dbCreateLoanevent(this);

    return loanevent;
  }

  async raiseEvent() {
    LoaneventCreatedPublisher.Publish(this.output, this.session).catch(
      (err) => {
        console.log("Publisher Error in Rest Controller:", err);
      },
    );
  }

  async getDataClause() {
    const { newObjectId } = require("common");

    const { hashString } = require("common");

    if (this.id) this.loanEventId = this.id;
    if (!this.loanEventId) this.loanEventId = newObjectId();

    const dataClause = {
      _id: this.loanEventId,
      loanId: this.loanId,
      eventType: this.eventType,
      eventDate: this.eventDate,
      actorUserId: this.actorUserId,
      note: this.note,
    };

    return dataClause;
  }
}

module.exports = CreateLoanEventManager;
