const { CreateLoanManager } = require("managers");

const LendingRestController = require("../../LendingServiceRestController");

class CreateLoanRestController extends LendingRestController {
  constructor(req, res) {
    super("createLoan", "createloan", req, res);
    this.dataName = "loan";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateLoanManager(this._req, "rest");
  }
}

const createLoan = async (req, res, next) => {
  const createLoanRestController = new CreateLoanRestController(req, res);
  try {
    await createLoanRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createLoan;
