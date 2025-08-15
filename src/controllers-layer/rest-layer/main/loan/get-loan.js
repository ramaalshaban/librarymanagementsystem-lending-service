const { GetLoanManager } = require("managers");

const LendingRestController = require("../../LendingServiceRestController");

class GetLoanRestController extends LendingRestController {
  constructor(req, res) {
    super("getLoan", "getloan", req, res);
    this.dataName = "loan";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetLoanManager(this._req, "rest");
  }
}

const getLoan = async (req, res, next) => {
  const getLoanRestController = new GetLoanRestController(req, res);
  try {
    await getLoanRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getLoan;
