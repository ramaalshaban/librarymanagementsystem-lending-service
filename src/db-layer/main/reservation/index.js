const utils = require("./utils");
const dbApiScripts = require("./dbApiScripts");

module.exports = {
  dbGetReservation: require("./dbGetReservation"),
  dbCreateReservation: require("./dbCreateReservation"),
  dbUpdateReservation: require("./dbUpdateReservation"),
  dbDeleteReservation: require("./dbDeleteReservation"),
  dbListReservations: require("./dbListReservations"),
  createReservation: utils.createReservation,
  getIdListOfReservationByField: utils.getIdListOfReservationByField,
  getReservationById: utils.getReservationById,
  getReservationAggById: utils.getReservationAggById,
  getReservationListByQuery: utils.getReservationListByQuery,
  getReservationStatsByQuery: utils.getReservationStatsByQuery,
  getReservationByQuery: utils.getReservationByQuery,
  updateReservationById: utils.updateReservationById,
  updateReservationByIdList: utils.updateReservationByIdList,
  updateReservationByQuery: utils.updateReservationByQuery,
  deleteReservationById: utils.deleteReservationById,
  deleteReservationByQuery: utils.deleteReservationByQuery,
};
