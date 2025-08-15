const { inject } = require("mindbricks-api-face");

module.exports = (app) => {
  const authUrl = (process.env.SERVICE_URL ?? "mindbricks.com").replace(
    process.env.SERVICE_SHORT_NAME,
    "auth",
  );

  const config = {
    name: "librarymanagementsystem - lending",
    brand: {
      name: "librarymanagementsystem",
      image: "https://mindbricks.com/favicon.ico",
      moduleName: "lending",
      version: process.env.SERVICE_VERSION || "1.0.0",
    },
    auth: {
      url: authUrl,
      loginPath: "/login",
      logoutPath: "/logout",
      currentUserPath: "/currentuser",
      authStrategy: "external",
      initialAuth: true,
    },
    dataObjects: [
      {
        name: "Loan",
        description:
          "Represents a book lending/checkout instance; tracks lending lifecycle (checkout, due, return, renewal/overdue status), related user, book, branch inventory.",
        reference: {
          tableName: "loan",
          properties: [
            {
              name: "userId",
              type: "ID",
            },

            {
              name: "bookId",
              type: "ID",
            },

            {
              name: "branchId",
              type: "ID",
            },

            {
              name: "branchInventoryId",
              type: "ID",
            },

            {
              name: "status",
              type: "Enum",
            },

            {
              name: "checkedOutAt",
              type: "Date",
            },

            {
              name: "dueDate",
              type: "Date",
            },

            {
              name: "returnedAt",
              type: "Date",
            },

            {
              name: "renewalCount",
              type: "Integer",
            },

            {
              name: "renewalHistory",
              type: "[Object]",
            },

            {
              name: "lastRenewedAt",
              type: "Date",
            },

            {
              name: "checkedOutBy",
              type: "ID",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/loans/{loanId}",
            title: "getLoan",
            query: [],

            parameters: [
              {
                key: "loanId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/loans",
            title: "createLoan",
            query: [],

            body: {
              type: "json",
              content: {
                userId: "ID",
                bookId: "ID",
                branchId: "ID",
                branchInventoryId: "ID",
                status: "Enum",
                checkedOutAt: "Date",
                dueDate: "Date",
                returnedAt: "Date",
                renewalCount: "Integer",
                renewalHistory: "Object",
                lastRenewedAt: "Date",
                checkedOutBy: "ID",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/loans/{loanId}",
            title: "updateLoan",
            query: [],

            body: {
              type: "json",
              content: {
                status: "Enum",
                dueDate: "Date",
                returnedAt: "Date",
                renewalCount: "Integer",
                renewalHistory: "Object",
                lastRenewedAt: "Date",
              },
            },

            parameters: [
              {
                key: "loanId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/loans/{loanId}",
            title: "deleteLoan",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "loanId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/loans",
            title: "listLoans",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "Reservation",
        description:
          "Reservation/Hold for a book at a branch; supports individual queue of reservation requests, fulfillment, and cancellation.",
        reference: {
          tableName: "reservation",
          properties: [
            {
              name: "userId",
              type: "ID",
            },

            {
              name: "bookId",
              type: "ID",
            },

            {
              name: "branchId",
              type: "ID",
            },

            {
              name: "status",
              type: "Enum",
            },

            {
              name: "requestedAt",
              type: "Date",
            },

            {
              name: "queuePosition",
              type: "Integer",
            },

            {
              name: "activationNotifiedAt",
              type: "Date",
            },

            {
              name: "fulfilledAt",
              type: "Date",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/reservations/{reservationId}",
            title: "getReservation",
            query: [],

            parameters: [
              {
                key: "reservationId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/reservations",
            title: "createReservation",
            query: [],

            body: {
              type: "json",
              content: {
                userId: "ID",
                bookId: "ID",
                branchId: "ID",
                status: "Enum",
                requestedAt: "Date",
                queuePosition: "Integer",
                activationNotifiedAt: "Date",
                fulfilledAt: "Date",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/reservations/{reservationId}",
            title: "updateReservation",
            query: [],

            body: {
              type: "json",
              content: {
                status: "Enum",
                queuePosition: "Integer",
                activationNotifiedAt: "Date",
                fulfilledAt: "Date",
              },
            },

            parameters: [
              {
                key: "reservationId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/reservations/{reservationId}",
            title: "deleteReservation",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "reservationId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/reservations",
            title: "listReservations",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "LoanEvent",
        description:
          "Log/audit entry for each major event in lending lifecycle: checkout, return, renewal, reservation fulfillment, overdue, cancellation, etc.",
        reference: {
          tableName: "loanEvent",
          properties: [
            {
              name: "loanId",
              type: "ID",
            },

            {
              name: "eventType",
              type: "Enum",
            },

            {
              name: "eventDate",
              type: "Date",
            },

            {
              name: "actorUserId",
              type: "ID",
            },

            {
              name: "note",
              type: "Text",
            },
          ],
        },
        endpoints: [
          {
            isAuth: true,
            method: "GET",
            url: "/loanevents/{loanEventId}",
            title: "getLoanEvent",
            query: [],

            parameters: [
              {
                key: "loanEventId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/loanevents",
            title: "createLoanEvent",
            query: [],

            body: {
              type: "json",
              content: {
                loanId: "ID",
                eventType: "Enum",
                eventDate: "Date",
                actorUserId: "ID",
                note: "Text",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/loanevents/{loanEventId}",
            title: "updateLoanEvent",
            query: [],

            body: {
              type: "json",
              content: {
                note: "Text",
              },
            },

            parameters: [
              {
                key: "loanEventId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/loanevents/{loanEventId}",
            title: "deleteLoanEvent",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "loanEventId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/loanevents",
            title: "listLoanEvents",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },
    ],
  };

  inject(app, config);
};
