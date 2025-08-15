const { UpdateLoanEventManager } = require("managers");

const LendingRestController = require("../../LendingServiceRestController");

class UpdateLoanEventRestController extends LendingRestController {
  constructor(req, res) {
    super("updateLoanEvent", "updateloanevent", req, res);
    this.dataName = "loanEvent";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateLoanEventManager(this._req, "rest");
  }
}

const updateLoanEvent = async (req, res, next) => {
  const updateLoanEventRestController = new UpdateLoanEventRestController(
    req,
    res,
  );
  try {
    await updateLoanEventRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateLoanEvent;
