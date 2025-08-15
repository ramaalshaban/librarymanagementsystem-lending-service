const express = require("express");

// LoanEvent Db Object Rest Api Router
const loanEventRouter = express.Router();

// add LoanEvent controllers

// getLoanEvent controller
loanEventRouter.get("/loanevents/:loanEventId", require("./get-loanevent"));
// createLoanEvent controller
loanEventRouter.post("/loanevents", require("./create-loanevent"));
// updateLoanEvent controller
loanEventRouter.patch(
  "/loanevents/:loanEventId",
  require("./update-loanevent"),
);
// deleteLoanEvent controller
loanEventRouter.delete(
  "/loanevents/:loanEventId",
  require("./delete-loanevent"),
);
// listLoanEvents controller
loanEventRouter.get("/loanevents", require("./list-loanevents"));

module.exports = loanEventRouter;
