const { GetLoanEventManager } = require("managers");

const LendingRestController = require("../../LendingServiceRestController");

class GetLoanEventRestController extends LendingRestController {
  constructor(req, res) {
    super("getLoanEvent", "getloanevent", req, res);
    this.dataName = "loanEvent";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetLoanEventManager(this._req, "rest");
  }
}

const getLoanEvent = async (req, res, next) => {
  const getLoanEventRestController = new GetLoanEventRestController(req, res);
  try {
    await getLoanEventRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getLoanEvent;
