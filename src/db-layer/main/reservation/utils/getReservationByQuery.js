const { HttpServerError, BadRequestError } = require("common");

const { Reservation } = require("models");

const getReservationByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const reservation = await Reservation.findOne({
      ...query,
      isActive: true,
    });

    if (!reservation) return null;

    return reservation.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingReservationByQuery",
      err,
    );
  }
};

module.exports = getReservationByQuery;
