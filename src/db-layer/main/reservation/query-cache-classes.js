const { QueryCache, QueryCacheInvalidator } = require("common");

class ReservationQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("reservation", [], "$and", "$eq", input, wClause);
  }
}
class ReservationQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("reservation", []);
  }
}

module.exports = {
  ReservationQueryCache,
  ReservationQueryCacheInvalidator,
};
