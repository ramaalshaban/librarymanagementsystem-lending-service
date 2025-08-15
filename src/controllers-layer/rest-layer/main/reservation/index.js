const express = require("express");

// Reservation Db Object Rest Api Router
const reservationRouter = express.Router();

// add Reservation controllers

// getReservation controller
reservationRouter.get(
  "/reservations/:reservationId",
  require("./get-reservation"),
);
// createReservation controller
reservationRouter.post("/reservations", require("./create-reservation"));
// updateReservation controller
reservationRouter.patch(
  "/reservations/:reservationId",
  require("./update-reservation"),
);
// deleteReservation controller
reservationRouter.delete(
  "/reservations/:reservationId",
  require("./delete-reservation"),
);
// listReservations controller
reservationRouter.get("/reservations", require("./list-reservations"));

module.exports = reservationRouter;
