const { UpdateReservationManager } = require("managers");

const LendingRestController = require("../../LendingServiceRestController");

class UpdateReservationRestController extends LendingRestController {
  constructor(req, res) {
    super("updateReservation", "updatereservation", req, res);
    this.dataName = "reservation";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateReservationManager(this._req, "rest");
  }
}

const updateReservation = async (req, res, next) => {
  const updateReservationRestController = new UpdateReservationRestController(
    req,
    res,
  );
  try {
    await updateReservationRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateReservation;
