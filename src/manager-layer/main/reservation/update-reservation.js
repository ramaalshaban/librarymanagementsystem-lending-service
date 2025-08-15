const ReservationManager = require("./ReservationManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const {
  ReservationUpdatedPublisher,
} = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbUpdateReservation } = require("dbLayer");

class UpdateReservationManager extends ReservationManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateReservation",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "reservation";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.reservationId = this.reservationId;
    jsonObj.status = this.status;
    jsonObj.queuePosition = this.queuePosition;
    jsonObj.activationNotifiedAt = this.activationNotifiedAt;
    jsonObj.fulfilledAt = this.fulfilledAt;
  }

  readRestParameters(request) {
    this.reservationId = request.params?.reservationId;
    this.status = request.body?.status;
    this.queuePosition = request.body?.queuePosition;
    this.activationNotifiedAt = request.body?.activationNotifiedAt;
    this.fulfilledAt = request.body?.fulfilledAt;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.reservationId = request.mcpParams.reservationId;
    this.status = request.mcpParams.status;
    this.queuePosition = request.mcpParams.queuePosition;
    this.activationNotifiedAt = request.mcpParams.activationNotifiedAt;
    this.fulfilledAt = request.mcpParams.fulfilledAt;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getReservationById } = require("dbLayer");
    this.reservation = await getReservationById(this.reservationId);
    if (!this.reservation) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.reservationId == null) {
      throw new BadRequestError("errMsg_reservationIdisRequired");
    }

    // ID
    if (
      this.reservationId &&
      !isValidObjectId(this.reservationId) &&
      !isValidUUID(this.reservationId)
    ) {
      throw new BadRequestError("errMsg_reservationIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.reservation?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbUpdateReservation function to update the reservation and return the result to the controller
    const reservation = await dbUpdateReservation(this);

    return reservation;
  }

  async raiseEvent() {
    ReservationUpdatedPublisher.Publish(this.output, this.session).catch(
      (err) => {
        console.log("Publisher Error in Rest Controller:", err);
      },
    );
  }

  async getRouteQuery() {
    return { $and: [{ id: this.reservationId }, { isActive: true }] };

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
      queuePosition: this.queuePosition,
      activationNotifiedAt: this.activationNotifiedAt,
      fulfilledAt: this.fulfilledAt,
    };

    return dataClause;
  }
}

module.exports = UpdateReservationManager;
