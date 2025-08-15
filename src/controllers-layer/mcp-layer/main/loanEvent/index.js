module.exports = (headers) => {
  // LoanEvent Db Object Rest Api Router
  const loanEventMcpRouter = [];
  // getLoanEvent controller
  loanEventMcpRouter.push(require("./get-loanevent")(headers));
  // createLoanEvent controller
  loanEventMcpRouter.push(require("./create-loanevent")(headers));
  // updateLoanEvent controller
  loanEventMcpRouter.push(require("./update-loanevent")(headers));
  // deleteLoanEvent controller
  loanEventMcpRouter.push(require("./delete-loanevent")(headers));
  // listLoanEvents controller
  loanEventMcpRouter.push(require("./list-loanevents")(headers));
  return loanEventMcpRouter;
};
