const { ListLoansManager } = require("managers");

const LendingRestController = require("../../LendingServiceRestController");

class ListLoansRestController extends LendingRestController {
  constructor(req, res) {
    super("listLoans", "listloans", req, res);
    this.dataName = "loans";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListLoansManager(this._req, "rest");
  }
}

const listLoans = async (req, res, next) => {
  const listLoansRestController = new ListLoansRestController(req, res);
  try {
    await listLoansRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listLoans;
