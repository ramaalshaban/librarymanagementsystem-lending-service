const { UpdateLoanManager } = require("managers");

const LendingRestController = require("../../LendingServiceRestController");

class UpdateLoanRestController extends LendingRestController {
  constructor(req, res) {
    super("updateLoan", "updateloan", req, res);
    this.dataName = "loan";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateLoanManager(this._req, "rest");
  }
}

const updateLoan = async (req, res, next) => {
  const updateLoanRestController = new UpdateLoanRestController(req, res);
  try {
    await updateLoanRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateLoan;
