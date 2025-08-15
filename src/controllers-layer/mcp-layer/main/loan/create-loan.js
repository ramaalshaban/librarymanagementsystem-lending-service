const { CreateLoanManager } = require("managers");
const { z } = require("zod");

const LendingMcpController = require("../../LendingServiceMcpController");

class CreateLoanMcpController extends LendingMcpController {
  constructor(params) {
    super("createLoan", "createloan", params);
    this.dataName = "loan";
    this.crudType = "create";
  }

  createApiManager() {
    return new CreateLoanManager(this.request, "mcp");
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
        .enum([])
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
        .describe("Datetime book was actually returned (null if outstanding)."),

      renewalCount: z
        .number()
        .int()
        .describe("Number of times this loan has been renewed."),

      renewalHistory: z
        .object({})
        .optional()
        .describe(
          "Array of renewal objects: {renewedAt: Date, renewedByUserId: ID, newDueDate: Date}. Stores all renewal actions for this loan.",
        ),

      lastRenewedAt: z
        .string()
        .optional()
        .describe("Datetime of last renewal event for this loan."),

      checkedOutBy: z
        .string()
        .uuid()
        .describe(
          "UserId who performed the checkout (could be librarian or the member themselves, for auditing).",
        ),
    };
  }
}

module.exports = (headers) => {
  return {
    name: "createLoan",
    description: "Create a new loan (book checkout).",
    parameters: CreateLoanMcpController.getInputScheme(),
    controller: async (mcpParams) => {
      mcpParams.headers = headers;
      const createLoanMcpController = new CreateLoanMcpController(mcpParams);
      try {
        const result = await createLoanMcpController.processRequest();
        //return CreateLoanMcpController.getOutputSchema().parse(result);
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
