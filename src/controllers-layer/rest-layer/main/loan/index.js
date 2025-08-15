const express = require("express");

// Loan Db Object Rest Api Router
const loanRouter = express.Router();

// add Loan controllers

// getLoan controller
loanRouter.get("/loans/:loanId", require("./get-loan"));
// createLoan controller
loanRouter.post("/loans", require("./create-loan"));
// updateLoan controller
loanRouter.patch("/loans/:loanId", require("./update-loan"));
// deleteLoan controller
loanRouter.delete("/loans/:loanId", require("./delete-loan"));
// listLoans controller
loanRouter.get("/loans", require("./list-loans"));

module.exports = loanRouter;
