const LendingServiceGrpcController = require("./LendingServiceGrpcController");

module.exports = (name, routeName, call, callback) => {
  const grpcController = new LendingServiceGrpcController(
    name,
    routeName,
    call,
    callback,
  );
  return grpcController;
};
