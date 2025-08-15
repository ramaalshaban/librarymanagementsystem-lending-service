const { ListReservationsManager } = require("managers");

const LendingRestController = require("../../LendingServiceRestController");

class ListReservationsRestController extends LendingRestController {
  constructor(req, res) {
    super("listReservations", "listreservations", req, res);
    this.dataName = "reservations";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListReservationsManager(this._req, "rest");
  }
}

const listReservations = async (req, res, next) => {
  const listReservationsRestController = new ListReservationsRestController(
    req,
    res,
  );
  try {
    await listReservationsRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listReservations;
