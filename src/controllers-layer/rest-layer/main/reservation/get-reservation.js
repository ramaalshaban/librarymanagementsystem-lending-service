const { GetReservationManager } = require("managers");

const LendingRestController = require("../../LendingServiceRestController");

class GetReservationRestController extends LendingRestController {
  constructor(req, res) {
    super("getReservation", "getreservation", req, res);
    this.dataName = "reservation";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetReservationManager(this._req, "rest");
  }
}

const getReservation = async (req, res, next) => {
  const getReservationRestController = new GetReservationRestController(
    req,
    res,
  );
  try {
    await getReservationRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getReservation;
