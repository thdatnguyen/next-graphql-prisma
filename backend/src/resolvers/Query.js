const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');
const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
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
  async users(_parent, _args, ctx, info) {
    // check if they are logged in
    if (!ctx.request.userId) throw new Error('You must be logged in');
    // check if the user has the permissions to query all the users
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);
    // query all the user
    return ctx.db.query.users({}, info);
  },
  async order(_parent, args, ctx, info) {
    // check if they are logged in
    if (!ctx.request.userId) throw new Error('You must be logged in');
    // query the current order
    const order = await ctx.db.query.order(
      {
        where: { id: args.id },
      },
      info
    );
    // check if they hare permissions to see the order
    const ownsOrder = order.user.id === ctx.request.userId;
    const hasPermissionToSeeOrder = ctx.request.user.permissions.includes(
      'ADMIN'
    );
    if (!ownsOrder && !hasPermissionToSeeOrder)
      throw new Error('You cant see this order detail');
    // return the order
    return order;
  },
  async orders(_parent, args, ctx, info) {
    const { userId } = ctx.request;
    if (!ctx.request.userId) throw new Error('You must be logged in');
    const orders = await ctx.db.query.orders(
      {
        where: {
          user: { id: userId },
        },
      },
      info
    );
    return orders;
  },
};

module.exports = Query;
