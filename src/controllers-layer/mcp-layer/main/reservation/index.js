module.exports = (headers) => {
  // Reservation Db Object Rest Api Router
  const reservationMcpRouter = [];
  // getReservation controller
  reservationMcpRouter.push(require("./get-reservation")(headers));
  // createReservation controller
  reservationMcpRouter.push(require("./create-reservation")(headers));
  // updateReservation controller
  reservationMcpRouter.push(require("./update-reservation")(headers));
  // deleteReservation controller
  reservationMcpRouter.push(require("./delete-reservation")(headers));
  // listReservations controller
  reservationMcpRouter.push(require("./list-reservations")(headers));
  return reservationMcpRouter;
};
