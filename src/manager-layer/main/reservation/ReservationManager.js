const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const LendingServiceManager = require("../../service-manager/LendingServiceManager");

/* Base Class For the Crud Routes Of DbObject Reservation */
class ReservationManager extends LendingServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "reservation";
    this.modelName = "Reservation";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = ReservationManager;
