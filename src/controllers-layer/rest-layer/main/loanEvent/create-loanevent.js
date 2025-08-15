const { CreateLoanEventManager } = require("managers");

const LendingRestController = require("../../LendingServiceRestController");

class CreateLoanEventRestController extends LendingRestController {
  constructor(req, res) {
    super("createLoanEvent", "createloanevent", req, res);
    this.dataName = "loanEvent";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateLoanEventManager(this._req, "rest");
  }
}

const createLoanEvent = async (req, res, next) => {
  const createLoanEventRestController = new CreateLoanEventRestController(
    req,
    res,
  );
  try {
    await createLoanEventRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createLoanEvent;
