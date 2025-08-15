const loanFunctions = require("./loan");
const reservationFunctions = require("./reservation");
const loanEventFunctions = require("./loanEvent");

module.exports = {
  // main Database
  // Loan Db Object
  dbGetLoan: loanFunctions.dbGetLoan,
  dbCreateLoan: loanFunctions.dbCreateLoan,
  dbUpdateLoan: loanFunctions.dbUpdateLoan,
  dbDeleteLoan: loanFunctions.dbDeleteLoan,
  dbListLoans: loanFunctions.dbListLoans,
  createLoan: loanFunctions.createLoan,
  getIdListOfLoanByField: loanFunctions.getIdListOfLoanByField,
  getLoanById: loanFunctions.getLoanById,
  getLoanAggById: loanFunctions.getLoanAggById,
  getLoanListByQuery: loanFunctions.getLoanListByQuery,
  getLoanStatsByQuery: loanFunctions.getLoanStatsByQuery,
  getLoanByQuery: loanFunctions.getLoanByQuery,
  updateLoanById: loanFunctions.updateLoanById,
  updateLoanByIdList: loanFunctions.updateLoanByIdList,
  updateLoanByQuery: loanFunctions.updateLoanByQuery,
  deleteLoanById: loanFunctions.deleteLoanById,
  deleteLoanByQuery: loanFunctions.deleteLoanByQuery,

  // Reservation Db Object
  dbGetReservation: reservationFunctions.dbGetReservation,
  dbCreateReservation: reservationFunctions.dbCreateReservation,
  dbUpdateReservation: reservationFunctions.dbUpdateReservation,
  dbDeleteReservation: reservationFunctions.dbDeleteReservation,
  dbListReservations: reservationFunctions.dbListReservations,
  createReservation: reservationFunctions.createReservation,
  getIdListOfReservationByField:
    reservationFunctions.getIdListOfReservationByField,
  getReservationById: reservationFunctions.getReservationById,
  getReservationAggById: reservationFunctions.getReservationAggById,
  getReservationListByQuery: reservationFunctions.getReservationListByQuery,
  getReservationStatsByQuery: reservationFunctions.getReservationStatsByQuery,
  getReservationByQuery: reservationFunctions.getReservationByQuery,
  updateReservationById: reservationFunctions.updateReservationById,
  updateReservationByIdList: reservationFunctions.updateReservationByIdList,
  updateReservationByQuery: reservationFunctions.updateReservationByQuery,
  deleteReservationById: reservationFunctions.deleteReservationById,
  deleteReservationByQuery: reservationFunctions.deleteReservationByQuery,

  // LoanEvent Db Object
  dbGetLoanevent: loanEventFunctions.dbGetLoanevent,
  dbCreateLoanevent: loanEventFunctions.dbCreateLoanevent,
  dbUpdateLoanevent: loanEventFunctions.dbUpdateLoanevent,
  dbDeleteLoanevent: loanEventFunctions.dbDeleteLoanevent,
  dbListLoanevents: loanEventFunctions.dbListLoanevents,
  createLoanEvent: loanEventFunctions.createLoanEvent,
  getIdListOfLoanEventByField: loanEventFunctions.getIdListOfLoanEventByField,
  getLoanEventById: loanEventFunctions.getLoanEventById,
  getLoanEventAggById: loanEventFunctions.getLoanEventAggById,
  getLoanEventListByQuery: loanEventFunctions.getLoanEventListByQuery,
  getLoanEventStatsByQuery: loanEventFunctions.getLoanEventStatsByQuery,
  getLoanEventByQuery: loanEventFunctions.getLoanEventByQuery,
  updateLoanEventById: loanEventFunctions.updateLoanEventById,
  updateLoanEventByIdList: loanEventFunctions.updateLoanEventByIdList,
  updateLoanEventByQuery: loanEventFunctions.updateLoanEventByQuery,
  deleteLoanEventById: loanEventFunctions.deleteLoanEventById,
  deleteLoanEventByQuery: loanEventFunctions.deleteLoanEventByQuery,
};
