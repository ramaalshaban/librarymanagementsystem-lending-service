const utils = require("./utils");
const dbApiScripts = require("./dbApiScripts");

module.exports = {
  dbGetLoan: require("./dbGetLoan"),
  dbCreateLoan: require("./dbCreateLoan"),
  dbUpdateLoan: require("./dbUpdateLoan"),
  dbDeleteLoan: require("./dbDeleteLoan"),
  dbListLoans: require("./dbListLoans"),
  createLoan: utils.createLoan,
  getIdListOfLoanByField: utils.getIdListOfLoanByField,
  getLoanById: utils.getLoanById,
  getLoanAggById: utils.getLoanAggById,
  getLoanListByQuery: utils.getLoanListByQuery,
  getLoanStatsByQuery: utils.getLoanStatsByQuery,
  getLoanByQuery: utils.getLoanByQuery,
  updateLoanById: utils.updateLoanById,
  updateLoanByIdList: utils.updateLoanByIdList,
  updateLoanByQuery: utils.updateLoanByQuery,
  deleteLoanById: utils.deleteLoanById,
  deleteLoanByQuery: utils.deleteLoanByQuery,
};
