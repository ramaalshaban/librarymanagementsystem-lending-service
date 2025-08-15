const mainRouters = require("./main");
const sessionRouter = require("./session-router");
module.exports = {
  ...mainRouters,
  LendingServiceRestController: require("./LendingServiceRestController"),
  ...sessionRouter,
};
