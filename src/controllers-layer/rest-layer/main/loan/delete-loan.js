const { DeleteLoanManager } = require("managers");

const LendingRestController = require("../../LendingServiceRestController");

class DeleteLoanRestController extends LendingRestController {
  constructor(req, res) {
    super("deleteLoan", "deleteloan", req, res);
    this.dataName = "loan";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteLoanManager(this._req, "rest");
  }
}

const deleteLoan = async (req, res, next) => {
  const deleteLoanRestController = new DeleteLoanRestController(req, res);
  try {
    await deleteLoanRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteLoan;
