const { QueryCache, QueryCacheInvalidator } = require("common");

class LoanEventQueryCache extends QueryCache {
  constructor(input, wClause) {
    super("loanEvent", [], "$and", "$eq", input, wClause);
  }
}
class LoanEventQueryCacheInvalidator extends QueryCacheInvalidator {
  constructor() {
    super("loanEvent", []);
  }
}

module.exports = {
  LoanEventQueryCache,
  LoanEventQueryCacheInvalidator,
};
