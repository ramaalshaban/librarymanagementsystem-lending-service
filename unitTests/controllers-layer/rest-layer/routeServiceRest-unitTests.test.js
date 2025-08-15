const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//For these tests to work we need to export GetLoanRestController also from file getloan.js
describe("GetLoanRestController", () => {
  let GetLoanRestController, getLoan;
  let GetLoanManagerStub, processRequestStub;
  let req, res, next;

  beforeEach(() => {
    req = { requestId: "req-456" };
    res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };
    next = sinon.stub();

    // Stub for GetLoanManager constructor
    GetLoanManagerStub = sinon.stub();

    // Stub for processRequest inherited from RestController
    processRequestStub = sinon.stub();

    // Proxyquire module under test with mocks
    ({ GetLoanRestController, getLoan } = proxyquire(
      "../../../src/controllers-layer/rest-layer/main/loan/get-loan.js",
      {
        serviceCommon: {
          HexaLogTypes: {},
          hexaLogger: { insertInfo: sinon.stub(), insertError: sinon.stub() },
        },
        managers: {
          GetLoanManager: GetLoanManagerStub,
        },
        "../../LendingServiceRestController": class {
          constructor(name, routeName, _req, _res, _next) {
            this.name = name;
            this.routeName = routeName;
            this._req = _req;
            this._res = _res;
            this._next = _next;
            this.processRequest = processRequestStub;
          }
        },
      },
    ));
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("GetLoanRestController class", () => {
    it("should extend RestController with correct values", () => {
      const controller = new GetLoanRestController(req, res, next);

      expect(controller.name).to.equal("getLoan");
      expect(controller.routeName).to.equal("getloan");
      expect(controller.dataName).to.equal("loan");
      expect(controller.crudType).to.equal("get");
      expect(controller.status).to.equal(200);
      expect(controller.httpMethod).to.equal("GET");
    });

    it("should create GetLoanManager in createApiManager()", () => {
      const controller = new GetLoanRestController(req, res, next);
      controller._req = req;

      controller.createApiManager();

      expect(GetLoanManagerStub.calledOnceWithExactly(req, "rest")).to.be.true;
    });
  });

  describe("getLoan function", () => {
    it("should create instance and call processRequest", async () => {
      await getLoan(req, res, next);

      expect(processRequestStub.calledOnce).to.be.true;
    });
  });
});
