const LendingServiceRestController = require("./LendingServiceRestController");

module.exports = (name, routeName, req, res) => {
  const restController = new LendingServiceRestController(
    name,
    routeName,
    req,
    res,
  );
  return restController;
};
