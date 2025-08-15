const ReservationManager = require("./ReservationManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const {
  ReservationCreatedPublisher,
} = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbCreateReservation } = require("dbLayer");

class CreateReservationManager extends ReservationManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createReservation",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "reservation";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.userId = this.userId;
    jsonObj.bookId = this.bookId;
    jsonObj.branchId = this.branchId;
    jsonObj.status = this.status;
    jsonObj.requestedAt = this.requestedAt;
    jsonObj.queuePosition = this.queuePosition;
    jsonObj.activationNotifiedAt = this.activationNotifiedAt;
    jsonObj.fulfilledAt = this.fulfilledAt;
  }

  readRestParameters(request) {
    this.userId = request.body?.userId;
    this.bookId = request.body?.bookId;
    this.branchId = request.body?.branchId;
    this.status = request.body?.status;
    this.requestedAt = request.body?.requestedAt;
    this.queuePosition = request.body?.queuePosition;
    this.activationNotifiedAt = request.body?.activationNotifiedAt;
    this.fulfilledAt = request.body?.fulfilledAt;
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
    this.status = request.mcpParams.status;
    this.requestedAt = request.mcpParams.requestedAt;
    this.queuePosition = request.mcpParams.queuePosition;
    this.activationNotifiedAt = request.mcpParams.activationNotifiedAt;
    this.fulfilledAt = request.mcpParams.fulfilledAt;
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

    if (this.status == null) {
      throw new BadRequestError("errMsg_statusisRequired");
    }

    if (this.requestedAt == null) {
      throw new BadRequestError("errMsg_requestedAtisRequired");
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
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.reservation?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateReservation function to create the reservation and return the result to the controller
    const reservation = await dbCreateReservation(this);

    return reservation;
  }

  async raiseEvent() {
    ReservationCreatedPublisher.Publish(this.output, this.session).catch(
      (err) => {
        console.log("Publisher Error in Rest Controller:", err);
      },
    );
  }

  async getDataClause() {
    const { newObjectId } = require("common");

    const { hashString } = require("common");

    if (this.id) this.reservationId = this.id;
    if (!this.reservationId) this.reservationId = newObjectId();

    const dataClause = {
      _id: this.reservationId,
      userId: this.userId,
      bookId: this.bookId,
      branchId: this.branchId,
      status: this.status,
      requestedAt: this.requestedAt,
      queuePosition: this.queuePosition,
      activationNotifiedAt: this.activationNotifiedAt,
      fulfilledAt: this.fulfilledAt,
    };

    return dataClause;
  }
}

module.exports = CreateReservationManager;
