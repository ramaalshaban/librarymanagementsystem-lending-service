const RestController = require("./RestController");

class LendingServiceRestController extends RestController {
  constructor(name, routeName, req, res) {
    super(name, routeName, req, res);
    this.projectCodename = "librarymanagementsystem";
    this.isMultiTenant = false;
    this.tenantName = "";
    this.tenantId = "";
    this.tenantCodename = null;
    this.isLoginApi = false;
  }

  createApiManager() {
    return null;
  }
}

module.exports = LendingServiceRestController;
