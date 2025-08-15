module.exports = (headers) => {
  // main Database Crud Object Mcp Api Routers
  return {
    loanMcpRouter: require("./loan")(headers),
    reservationMcpRouter: require("./reservation")(headers),
    loanEventMcpRouter: require("./loanEvent")(headers),
  };
};
