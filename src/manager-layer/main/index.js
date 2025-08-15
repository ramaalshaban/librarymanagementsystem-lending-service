module.exports = {
  // main Database Crud Object Routes Manager Layer Classes
  // Loan Db Object
  GetLoanManager: require("./loan/get-loan"),
  CreateLoanManager: require("./loan/create-loan"),
  UpdateLoanManager: require("./loan/update-loan"),
  DeleteLoanManager: require("./loan/delete-loan"),
  ListLoansManager: require("./loan/list-loans"),
  // Reservation Db Object
  GetReservationManager: require("./reservation/get-reservation"),
  CreateReservationManager: require("./reservation/create-reservation"),
  UpdateReservationManager: require("./reservation/update-reservation"),
  DeleteReservationManager: require("./reservation/delete-reservation"),
  ListReservationsManager: require("./reservation/list-reservations"),
  // LoanEvent Db Object
  GetLoanEventManager: require("./loanEvent/get-loanevent"),
  CreateLoanEventManager: require("./loanEvent/create-loanevent"),
  UpdateLoanEventManager: require("./loanEvent/update-loanevent"),
  DeleteLoanEventManager: require("./loanEvent/delete-loanevent"),
  ListLoanEventsManager: require("./loanEvent/list-loanevents"),
};
