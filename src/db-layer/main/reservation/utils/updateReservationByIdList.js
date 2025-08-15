const { HttpServerError } = require("common");

const { Reservation } = require("models");

const updateReservationByIdList = async (idList, dataClause) => {
  try {
    await Reservation.updateMany(
      { _id: { $in: idList }, isActive: true },
      dataClause,
    );

    const updatedDocs = await Reservation.find(
      { _id: { $in: idList }, isActive: true },
      { _id: 1 },
    );

    const reservationIdList = updatedDocs.map((doc) => doc._id);

    return reservationIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingReservationByIdList",
      err,
    );
  }
};

module.exports = updateReservationByIdList;
