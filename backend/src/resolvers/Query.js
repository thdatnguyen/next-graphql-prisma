const { forwardTo } = require("prisma-binding");
const Query = {
  itesm: forwardTo("db")
};

module.exports = Query;
