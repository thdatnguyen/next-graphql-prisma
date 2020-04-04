const { forwardTo } = require("prisma-binding");
const { hasPermission } = require("../utils");
const Query = {
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  me(_parent, _args, ctx, info) {
    // check if there is a current user Id
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId },
      },
      info
    );
  },
  async users(_parent, args, ctx, info) {
    // check if they are logged in
    if (!ctx.request.userId) throw new Error("You must be logged in");

    // check if the user has the permissions to query all the users
    hasPermission(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"]);
    // query all the user
    return ctx.db.query.users({}, info);
  },
};

module.exports = Query;
