const { GetLoanEventManager } = require("managers");
const { z } = require("zod");

const LendingMcpController = require("../../LendingServiceMcpController");

class GetLoanEventMcpController extends LendingMcpController {
  constructor(params) {
    super("getLoanEvent", "getloanevent", params);
    this.dataName = "loanEvent";
    this.crudType = "get";
  }

  createApiManager() {
    return new GetLoanEventManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        loanEvent: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            loanId: z
              .string()
              .uuid()
              .describe("ID of the loan related to the event"),
            eventType: z
              .enum([
                "checkout",
                "return",
                "renewal",
                "overdue",
                "reservationFulfilled",
                "cancellation",
                "lost",
              ])
              .describe(
                "Type of event in lending lifecycle (checkout, return, renewal, overdue, reservationFulfilled, cancellation, lost).",
              ),
            eventDate: z
              .string()
              .describe("Datetime event occurred (auto-now)."),
            actorUserId: z
              .string()
              .uuid()
              .describe("UserId performing the action (librarian or member)."),
            note: z
              .string()
              .optional()
              .nullable()
              .describe(
                "Any note or annotation for this event (librarian input/logging).",
              ),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Log/audit entry for each major event in lending lifecycle: checkout, return, renewal, reservation fulfillment, overdue, cancellation, etc.",
          ),
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
      loanEventId: z
        .string()
        .uuid()
        .describe(
          "This id paremeter is used to select the required data object that is queried",
        ),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "getLoanEvent",
    description: "Get lending event/audit record by ID.",
    parameters: GetLoanEventMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const getLoanEventMcpController = new GetLoanEventMcpController(
        mcpParams,
      );
      try {
        const result = await getLoanEventMcpController.processRequest();
        //return GetLoanEventMcpController.getOutputSchema().parse(result);
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
