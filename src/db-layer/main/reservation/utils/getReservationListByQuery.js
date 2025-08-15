const { HttpServerError, BadRequestError, NotFoundError } = require("common");
const { Reservation } = require("models");

const getReservationListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const reservation = await Reservation.find(query);

    if (!reservation || reservation.length === 0) return [];

    //should i add not found error or only return empty array?
    //      if (!reservation || reservation.length === 0) {
    //      throw new NotFoundError(
    //      `Reservation with the specified criteria not found`
    //  );
    //}

    return reservation.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingReservationListByQuery",
      err,
    );
  }
};

module.exports = getReservationListByQuery;
