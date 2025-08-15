const { HttpServerError } = require("common");

const { Reservation } = require("models");

const getReservationById = async (reservationId) => {
  try {
    let reservation;

    if (Array.isArray(reservationId)) {
      reservation = await Reservation.find({
        _id: { $in: reservationId },
        isActive: true,
      });
    } else {
      reservation = await Reservation.findOne({
        _id: reservationId,
        isActive: true,
      });
    }

    if (!reservation) {
      return null;
    }

    return Array.isArray(reservationId)
      ? reservation.map((item) => item.getData())
      : reservation.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingReservationById",
      err,
    );
  }
};

module.exports = getReservationById;
