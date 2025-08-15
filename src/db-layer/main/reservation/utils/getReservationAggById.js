const { HttpServerError } = require("common");

const { Reservation } = require("models");

const getReservationAggById = async (reservationId) => {
  try {
    let reservationQuery;

    if (Array.isArray(reservationId)) {
      reservationQuery = Reservation.find({
        _id: { $in: reservationId },
        isActive: true,
      });
    } else {
      reservationQuery = Reservation.findOne({
        _id: reservationId,
        isActive: true,
      });
    }

    // Populate associations as needed

    const reservation = await reservationQuery.exec();

    if (!reservation) {
      return null;
    }
    const reservationData =
      Array.isArray(reservationId) && reservationId.length > 0
        ? reservation.map((item) => item.getData())
        : reservation.getData();

    // should i add this here?
    await Reservation.getCqrsJoins(reservationData);

    return reservationData;
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingReservationAggById",
      err,
    );
  }
};

// "__PropertyEnumSettings.doc": "Enum configuration for the data property, applicable when the property type is set to Enum. While enum values are stored as integers in the database, defining the enum options here allows Mindbricks to enrich API responses with human-readable labels, easing interpretation and UI integration. If not defined, only the numeric value will be returned.",
// "PropertyEnumSettings": {
//   "__hasEnumOptions.doc": "Enables support for named enum values when the property type is Enum. Though values are stored as integers, enabling this adds the symbolic name to API responses for clarity.",
//   "__config.doc": "The configuration object for enum options. Leave it null if hasEnumOptions is false.",
//   "__activation": "hasEnumOptions",
//  "__lines": "\
//  a-hasEnumOptions\
//  g-config",
//  "hasEnumOptions": "Boolean",
//  "config": "PropertyEnumSettingsConfig"
//},

module.exports = getReservationAggById;
