const { ListReservationsManager } = require("managers");
const { z } = require("zod");

const LendingMcpController = require("../../LendingServiceMcpController");

class ListReservationsMcpController extends LendingMcpController {
  constructor(params) {
    super("listReservations", "listreservations", params);
    this.dataName = "reservations";
    this.crudType = "getList";
  }

  createApiManager() {
    return new ListReservationsManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        reservations: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            userId: z
              .string()
              .uuid()
              .describe("User/member requesting reservation."),
            bookId: z
              .string()
              .uuid()
              .describe("Book being reserved (catalog record)"),
            branchId: z
              .string()
              .uuid()
              .describe("Requested pickup/fulfillment branch for reservation"),
            status: z
              .enum([
                "active",
                "waiting",
                "fulfilled",
                "canceled",
                "expired",
                "noShow",
              ])
              .describe(
                "Reservation status (active/waiting, fulfilled, canceled, expired, no-show)",
              ),
            requestedAt: z
              .string()
              .describe("Datetime reservation was requested."),
            queuePosition: z
              .number()
              .int()
              .optional()
              .nullable()
              .describe(
                "If reservation is a queue, represents member's current position for this book at branch.",
              ),
            activationNotifiedAt: z
              .string()
              .optional()
              .nullable()
              .describe(
                "Date/time reservation was activated (user notified item ready).",
              ),
            fulfilledAt: z
              .string()
              .optional()
              .nullable()
              .describe(
                "Datetime reservation was fulfilled (converted to loan or picked up).",
              ),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Reservation/Hold for a book at a branch; supports individual queue of reservation requests, fulfillment, and cancellation.",
          )
          .array(),
      })
      .describe("The response object of the crud route");
  }

  static getInputScheme() {
    return {
      accessToken: z
        .string()
        .optional()
        .describe(
          "The access token which is returned from a login request or given by user. This access token will override if there is any bearer or OAuth token in the mcp client. If not given the request will be made with the system (bearer or OAuth) token. For public routes you dont need to deifne any access token.",
        ),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "listReservations",
    description:
      "List/query reservations/holds for books at a branch or for user, filter by status, support for queue ops.",
    parameters: ListReservationsMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const listReservationsMcpController = new ListReservationsMcpController(
        mcpParams,
      );
      try {
        const result = await listReservationsMcpController.processRequest();
        //return ListReservationsMcpController.getOutputSchema().parse(result);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result),
            },
          ],
        };
      } catch (err) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Error: ${err.message}`,
            },
          ],
        };
      }
    },
  };
};
