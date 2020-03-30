const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
  },

  async signup(_parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);
    //create user
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password
        }
      },
      info
    );

    //create JWT TOKEN
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // set the jwt as the collie on the response
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
    return user;
  }
};

module.exports = Mutations;
