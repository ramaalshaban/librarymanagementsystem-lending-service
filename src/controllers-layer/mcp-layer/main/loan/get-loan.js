const { GetLoanManager } = require("managers");
const { z } = require("zod");

const LendingMcpController = require("../../LendingServiceMcpController");

class GetLoanMcpController extends LendingMcpController {
  constructor(params) {
    super("getLoan", "getloan", params);
    this.dataName = "loan";
    this.crudType = "get";
  }

  createApiManager() {
    return new GetLoanManager(this.request, "mcp");
  }

  static getOutputSchema() {
    return z
      .object({
        status: z.string(),
        loan: z
          .object({
            id: z
              .string()
              .uuid()
              .describe("The unique primary key of the data object as UUID"),
            userId: z
              .string()
              .uuid()
              .describe("Member/user who is borrowing the book"),
            bookId: z
              .string()
              .uuid()
              .describe("ID of the borrowed book (catalog record)"),
            branchId: z
              .string()
              .uuid()
              .describe("Branch ID from which book was borrowed"),
            branchInventoryId: z
              .string()
              .uuid()
              .describe(
                "ID of branchInventory record for the specific copy/copies lent",
              ),
            status: z
              .enum(["active", "returned", "overdue", "lost", "canceled"])
              .describe(
                "Current status of the loan (active, returned, overdue, lost, canceled)",
              ),
            checkedOutAt: z
              .string()
              .describe("Datetime when loan/check-out started."),
            dueDate: z
              .string()
              .describe("Due date that the book must be returned by."),
            returnedAt: z
              .string()
              .optional()
              .nullable()
              .describe(
                "Datetime book was actually returned (null if outstanding).",
              ),
            renewalCount: z
              .number()
              .int()
              .describe("Number of times this loan has been renewed."),
            renewalHistory: z.array(
              z
                .object()
                .optional()
                .nullable()
                .describe(
                  "Array of renewal objects: {renewedAt: Date, renewedByUserId: ID, newDueDate: Date}. Stores all renewal actions for this loan.",
                ),
            ),
            lastRenewedAt: z
              .string()
              .optional()
              .nullable()
              .describe("Datetime of last renewal event for this loan."),
            checkedOutBy: z
              .string()
              .uuid()
              .describe(
                "UserId who performed the checkout (could be librarian or the member themselves, for auditing).",
              ),
            isActive: z
              .boolean()
              .describe(
                "The active status of the data object to manage soft delete. False when deleted.",
              ),
          })
          .describe(
            "Represents a book lending/checkout instance; tracks lending lifecycle (checkout, due, return, renewal/overdue status), related user, book, branch inventory.",
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
      loanId: z
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
    name: "getLoan",
    description: "Get loan/checkout record by ID.",
    parameters: GetLoanMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const getLoanMcpController = new GetLoanMcpController(mcpParams);
      try {
        const result = await getLoanMcpController.processRequest();
        //return GetLoanMcpController.getOutputSchema().parse(result);
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
