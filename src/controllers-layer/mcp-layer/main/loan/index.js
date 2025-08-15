module.exports = (headers) => {
  // Loan Db Object Rest Api Router
  const loanMcpRouter = [];
  // getLoan controller
  loanMcpRouter.push(require("./get-loan")(headers));
  // createLoan controller
  loanMcpRouter.push(require("./create-loan")(headers));
  // updateLoan controller
  loanMcpRouter.push(require("./update-loan")(headers));
  // deleteLoan controller
  loanMcpRouter.push(require("./delete-loan")(headers));
  // listLoans controller
  loanMcpRouter.push(require("./list-loans")(headers));
  return loanMcpRouter;
};
