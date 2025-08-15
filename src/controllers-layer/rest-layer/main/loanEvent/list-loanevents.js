const { ListLoanEventsManager } = require("managers");

const LendingRestController = require("../../LendingServiceRestController");

class ListLoanEventsRestController extends LendingRestController {
  constructor(req, res) {
    super("listLoanEvents", "listloanevents", req, res);
    this.dataName = "loanEvents";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListLoanEventsManager(this._req, "rest");
  }
}

const listLoanEvents = async (req, res, next) => {
  const listLoanEventsRestController = new ListLoanEventsRestController(
    req,
    res,
  );
  try {
    await listLoanEventsRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listLoanEvents;
