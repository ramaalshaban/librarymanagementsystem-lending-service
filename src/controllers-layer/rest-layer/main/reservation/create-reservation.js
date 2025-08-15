const { CreateReservationManager } = require("managers");

const LendingRestController = require("../../LendingServiceRestController");

class CreateReservationRestController extends LendingRestController {
  constructor(req, res) {
    super("createReservation", "createreservation", req, res);
    this.dataName = "reservation";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateReservationManager(this._req, "rest");
  }
}

const createReservation = async (req, res, next) => {
  const createReservationRestController = new CreateReservationRestController(
    req,
    res,
  );
  try {
    await createReservationRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createReservation;
