const utils = require("./utils");
const dbApiScripts = require("./dbApiScripts");

module.exports = {
  dbGetLoanevent: require("./dbGetLoanevent"),
  dbCreateLoanevent: require("./dbCreateLoanevent"),
  dbUpdateLoanevent: require("./dbUpdateLoanevent"),
  dbDeleteLoanevent: require("./dbDeleteLoanevent"),
  dbListLoanevents: require("./dbListLoanevents"),
  createLoanEvent: utils.createLoanEvent,
  getIdListOfLoanEventByField: utils.getIdListOfLoanEventByField,
  getLoanEventById: utils.getLoanEventById,
  getLoanEventAggById: utils.getLoanEventAggById,
  getLoanEventListByQuery: utils.getLoanEventListByQuery,
  getLoanEventStatsByQuery: utils.getLoanEventStatsByQuery,
  getLoanEventByQuery: utils.getLoanEventByQuery,
  updateLoanEventById: utils.updateLoanEventById,
  updateLoanEventByIdList: utils.updateLoanEventByIdList,
  updateLoanEventByQuery: utils.updateLoanEventByQuery,
  deleteLoanEventById: utils.deleteLoanEventById,
  deleteLoanEventByQuery: utils.deleteLoanEventByQuery,
};
