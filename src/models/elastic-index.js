const { ElasticIndexer } = require("serviceCommon");
const { hexaLogger } = require("common");

const loanMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  userId: { type: "keyword", index: true },
  bookId: { type: "keyword", index: true },
  branchId: { type: "keyword", index: true },
  branchInventoryId: { type: "keyword", index: true },
  status: { type: "keyword", index: true },
  status_: { type: "keyword" },
  checkedOutAt: { type: "date", index: true },
  dueDate: { type: "date", index: true },
  returnedAt: { type: "date", index: true },
  renewalCount: { type: "integer", index: false },
  renewalHistory: { type: "object", enabled: false },
  lastRenewedAt: { type: "date", index: true },
  checkedOutBy: { type: "keyword", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const reservationMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  userId: { type: "keyword", index: true },
  bookId: { type: "keyword", index: true },
  branchId: { type: "keyword", index: true },
  status: { type: "keyword", index: true },
  status_: { type: "keyword" },
  requestedAt: { type: "date", index: true },
  queuePosition: { type: "integer", index: true },
  activationNotifiedAt: { type: "date", index: false },
  fulfilledAt: { type: "date", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};
const loanEventMapping = {
  id: { type: "keyword" },
  _owner: { type: "keyword" },
  loanId: { type: "keyword", index: true },
  eventType: { type: "keyword", index: true },
  eventType_: { type: "keyword" },
  eventDate: { type: "date", index: true },
  actorUserId: { type: "keyword", index: true },
  note: { type: "text", index: false },
  isActive: { type: "boolean" },
  recordVersion: { type: "integer" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
};

const updateElasticIndexMappings = async () => {
  try {
    ElasticIndexer.addMapping("loan", loanMapping);
    await new ElasticIndexer("loan").updateMapping(loanMapping);
    ElasticIndexer.addMapping("reservation", reservationMapping);
    await new ElasticIndexer("reservation").updateMapping(reservationMapping);
    ElasticIndexer.addMapping("loanEvent", loanEventMapping);
    await new ElasticIndexer("loanEvent").updateMapping(loanEventMapping);
  } catch (err) {
    hexaLogger.insertError(
      "UpdateElasticIndexMappingsError",
      { function: "updateElasticIndexMappings" },
      "elastic-index.js->updateElasticIndexMappings",
      err,
    );
  }
};

module.exports = updateElasticIndexMappings;
