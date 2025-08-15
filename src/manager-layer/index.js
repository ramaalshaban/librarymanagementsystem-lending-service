module.exports = {
  LendingServiceManager: require("./service-manager/LendingServiceManager"),
  // main Database Crud Object Routes Manager Layer Classes
  // Loan Db Object
  GetLoanManager: require("./main/loan/get-loan"),
  CreateLoanManager: require("./main/loan/create-loan"),
  UpdateLoanManager: require("./main/loan/update-loan"),
  DeleteLoanManager: require("./main/loan/delete-loan"),
  ListLoansManager: require("./main/loan/list-loans"),
  // Reservation Db Object
  GetReservationManager: require("./main/reservation/get-reservation"),
  CreateReservationManager: require("./main/reservation/create-reservation"),
  UpdateReservationManager: require("./main/reservation/update-reservation"),
  DeleteReservationManager: require("./main/reservation/delete-reservation"),
  ListReservationsManager: require("./main/reservation/list-reservations"),
  // LoanEvent Db Object
  GetLoanEventManager: require("./main/loanEvent/get-loanevent"),
  CreateLoanEventManager: require("./main/loanEvent/create-loanevent"),
  UpdateLoanEventManager: require("./main/loanEvent/update-loanevent"),
  DeleteLoanEventManager: require("./main/loanEvent/delete-loanevent"),
  ListLoanEventsManager: require("./main/loanEvent/list-loanevents"),
};
