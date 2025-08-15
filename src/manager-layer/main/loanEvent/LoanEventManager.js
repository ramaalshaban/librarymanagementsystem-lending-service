const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const LendingServiceManager = require("../../service-manager/LendingServiceManager");

/* Base Class For the Crud Routes Of DbObject LoanEvent */
class LoanEventManager extends LendingServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "loanEvent";
    this.modelName = "LoanEvent";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = LoanEventManager;
