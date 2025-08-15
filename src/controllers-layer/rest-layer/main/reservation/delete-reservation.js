const { DeleteReservationManager } = require("managers");

const LendingRestController = require("../../LendingServiceRestController");

class DeleteReservationRestController extends LendingRestController {
  constructor(req, res) {
    super("deleteReservation", "deletereservation", req, res);
    this.dataName = "reservation";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteReservationManager(this._req, "rest");
  }
}

const deleteReservation = async (req, res, next) => {
  const deleteReservationRestController = new DeleteReservationRestController(
    req,
    res,
  );
  try {
    await deleteReservationRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteReservation;
