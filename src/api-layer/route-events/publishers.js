const { ServicePublisher } = require("serviceCommon");

// Loan Event Publisher Classes

// Publisher class for createLoan route
const { LoanCreatedTopic } = require("./topics");
class LoanCreatedPublisher extends ServicePublisher {
  constructor(loan, session, requestId) {
    super(LoanCreatedTopic, loan, session, requestId);
  }

  static async Publish(loan, session, requestId) {
    const _publisher = new LoanCreatedPublisher(loan, session, requestId);
    await _publisher.publish();
  }
}

// Publisher class for updateLoan route
const { LoanUpdatedTopic } = require("./topics");
class LoanUpdatedPublisher extends ServicePublisher {
  constructor(loan, session, requestId) {
    super(LoanUpdatedTopic, loan, session, requestId);
  }

  static async Publish(loan, session, requestId) {
    const _publisher = new LoanUpdatedPublisher(loan, session, requestId);
    await _publisher.publish();
  }
}

// Reservation Event Publisher Classes

// Publisher class for createReservation route
const { ReservationCreatedTopic } = require("./topics");
class ReservationCreatedPublisher extends ServicePublisher {
  constructor(reservation, session, requestId) {
    super(ReservationCreatedTopic, reservation, session, requestId);
  }

  static async Publish(reservation, session, requestId) {
    const _publisher = new ReservationCreatedPublisher(
      reservation,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// Publisher class for updateReservation route
const { ReservationUpdatedTopic } = require("./topics");
class ReservationUpdatedPublisher extends ServicePublisher {
  constructor(reservation, session, requestId) {
    super(ReservationUpdatedTopic, reservation, session, requestId);
  }

  static async Publish(reservation, session, requestId) {
    const _publisher = new ReservationUpdatedPublisher(
      reservation,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

// LoanEvent Event Publisher Classes

// Publisher class for createLoanEvent route
const { LoaneventCreatedTopic } = require("./topics");
class LoaneventCreatedPublisher extends ServicePublisher {
  constructor(loanevent, session, requestId) {
    super(LoaneventCreatedTopic, loanevent, session, requestId);
  }

  static async Publish(loanevent, session, requestId) {
    const _publisher = new LoaneventCreatedPublisher(
      loanevent,
      session,
      requestId,
    );
    await _publisher.publish();
  }
}

module.exports = {
  LoanCreatedPublisher,
  LoanUpdatedPublisher,
  ReservationCreatedPublisher,
  ReservationUpdatedPublisher,
  LoaneventCreatedPublisher,
};
