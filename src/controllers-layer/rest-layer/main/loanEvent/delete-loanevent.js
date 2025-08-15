const { DeleteLoanEventManager } = require("managers");

const LendingRestController = require("../../LendingServiceRestController");

class DeleteLoanEventRestController extends LendingRestController {
  constructor(req, res) {
    super("deleteLoanEvent", "deleteloanevent", req, res);
    this.dataName = "loanEvent";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteLoanEventManager(this._req, "rest");
  }
}

const deleteLoanEvent = async (req, res, next) => {
  const deleteLoanEventRestController = new DeleteLoanEventRestController(
    req,
    res,
  );
  try {
    await deleteLoanEventRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteLoanEvent;
