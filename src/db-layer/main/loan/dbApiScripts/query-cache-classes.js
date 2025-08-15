const { QueryCache, QueryCacheInvalidator } = require("common");

class LoanQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("loan", [], "$and", "$eq", input, wClause);
  }
}
class LoanQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("loan", []);
  }
}

module.exports = {
  LoanQueryCache,
  LoanQueryCacheInvalidator,
};
