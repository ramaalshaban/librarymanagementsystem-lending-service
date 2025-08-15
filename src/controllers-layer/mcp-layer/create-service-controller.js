const LendingServiceMcpController = require("./LendingServiceMcpController");

module.exports = (name, routeName, params) => {
  const mcpController = new LendingServiceMcpController(
    name,
    routeName,
    params,
  );
  return mcpController;
};
