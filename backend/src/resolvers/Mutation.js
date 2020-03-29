const Mutations = {
  async createItem(_parent, args, ctx, info) {
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
      },
      info
    );
    return item;
  },
  updateItem(_parent, args, ctx, info) {
    // take the copy of update item
    const updates = { ...args };
    // remove the ID from update item
    delete updates.id;
    // run the update method
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info
    );
  },
  async deleteItem(_parent, args, ctx, info) {
    const where = { id: args.id };
    // find the item
    const deleteItem = await ctx.db.query.item({ where }, `{id title}`);
    // check if they own that item, or have permission
    // TODO
    // delete
    return ctx.db.mutation.deleteItem({ where }, info);
  }
};

module.exports = Mutations;
