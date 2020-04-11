const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");
const { transport, makeANiceEmail } = require("../mail");
const { hasPermission } = require("../utils");
const Mutations = {
  async createItem(_parent, args, ctx, info) {
    if (!ctx.request.userId)
      throw new Error("You must be logged in to create new item");

    return await ctx.db.mutation.createItem(
      {
        data: {
          // how to create relationshop between item and user
          user: {
            connect: {
              id: ctx.request.userId
            }
          },
          ...args
        }
      },
      info
    );
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
          password,
          permissions: { set: ["USER"] }
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
  },
  async signin(parent, { email, password }, ctx, info) {
    // check user with email
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    // chekc password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid Password");
    }
    // generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // set the cookie with the token
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
    // return the user
    return user;
  },
  signout(parent, args, ctx, info) {
    ctx.response.clearCookie("token");
    return { message: "Goodbye" };
  },
  async requestReset(parent, args, ctx, info) {
    // Check if this is a real user
    const user = await ctx.db.query.user({ where: { email: args.email } });

    if (!user)
      throw new Error(`No such user founded for given email ${args.email}`);

    // Set a reset token and expiry on that user
    const randomBytesPromisified = promisify(randomBytes);
    const resetToken = (await randomBytesPromisified(20)).toString("hex");
    const resetTokenExpiry = Date.now() + 1000 * 60 * 60;
    const res = await ctx.db.mutation.updateUser({
      where: {
        email: args.email
      },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });
    //  test only
    console.log(res);
    // Email them that reset token
    const mailRes = await transport.sendMail({
      from: "thdat.nguyen@gmail.com",
      to: user.email,
      subject: "Your Password Reset Token",
      html: makeANiceEmail(
        user.name,
        `Your Password Reset Token is here: <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}" alt="reset password token">Click here to reset!</a>`
      )
    });
    // return success message
    return { message: "Thanks!" };
  },
  async resetPassword(_parent, args, ctx, _info) {
    const { password, confirmPassword, resetToken } = args;

    // check if the password match
    if (password !== confirmPassword)
      throw new Error(`Passwords do not match!`);

    // check if its a legit reset token
    const [user] = await ctx.db.query.users({
      where: {
        resetToken,
        resetTokenExpiry_gte: Date.now() - 1000 * 60 * 60
      }
    });

    // check if its expired
    if (!user) throw new Error(`This token is either invalid or expired`);

    // hash their new password
    const newPassword = await bcrypt.hash(password, 10);
    // Save the new password to the user and remove old resetToken fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password: newPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    // Generate JWT
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);

    // Set the JWT cookie
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
    // Return the new user
    return updatedUser;
  },
  async updatePermissions(_parent, args, ctx, info) {
    // check if they are logged in
    if (!ctx.request.userId) throw new Error("You have to log in");

    // query the current user
    const currentUser = await ctx.db.query.user(
      {
        where: {
          id: ctx.request.userId
        }
      },
      info
    );
    //check if they have permissios to do this
    hasPermission(currentUser, ["ADMIN", "PERMISSIONUPDATE"]);
    // update the permissions
    return ctx.db.mutation.updateUser(
      {
        data: {
          permissions: {
            set: args.permissions
          }
        },
        where: {
          id: args.userId
        }
      },
      info
    );
  },
  async addToCart(_parent, args, ctx, info) {
    // make sure they are signed in
    const { userId } = ctx.request;

    // query the users of current cart
    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId }.request,
        item: { id: args.id }
      }
    });
    // check if that item is already in cart and increament by 1 if it is
    if (existingCartItem) {
      console.log("This item is already in their cart");
      return ctx.db.mutation.updateCartItem(
        {
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + 1 }
        },
        info
      );
    }
    // if not, create a fresh cartItem
    return ctx.db.mutation.createCartItem(
      {
        data: {
          user: {
            connect: { id: userId }
          },
          item: {
            connect: {
              id: args.id
            }
          }
        }
      },
      info
    );
  },
  async removeFromCart(_parent, args, ctx, info) {
    // find the cart item
    const cartItem = await ctx.db.query.cartItem(
      {
        where: {
          id: args.id
        }
      },
      `{id, user {id}}`
    );
    // check if we found an item
    if (!cartItem) throw new Error("No Cart Item found!!!");
    // make sure they own that cart item
    if (cartItem.user.id !== ctx.request.userId)
      throw new Error("CHEATINGGGGG!");
    // delete that cart item
    // note: info is the query is coming in from the client side
    return ctx.db.mutation.deleteCartItem(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  }
};

module.exports = Mutations;
