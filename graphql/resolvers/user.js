const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");

module.exports = {
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User does not exist!");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Password is incorrect!");
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    return {
      userId: user.id,
      token: token,
      tokenExpiration: 1,
      user,
    };
  },
  viewer: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("UNAUTHENTICATED");
    }
    try {
      const user = await User.findById({ _id: req.userId });
      return user;
    } catch (err) {
      throw err;
    }
  },
  createAccount: async (args) => {
    try {
      const existingUser = await User.findOne({ email: args.input.email });
      if (existingUser) {
        throw new Error("User exists already.");
      }
      if (args.input.password !== args.input.confirmPassword) {
        throw new Error("Passwords don't match");
      }

      const hashedPassword = await bcrypt.hash(args.input.password, 12);

      const user = new User({
        firstName: args.input.firstName,
        lastName: args.input.lastName,
        email: args.input.email,
        password: hashedPassword,
      });
      const result = await user.save();
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      return {
        userId: user.id,
        token: token,
        tokenExpiration: 1,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: null,
        },
      };
    } catch (err) {
      throw err;
    }
  },
  updateAccount: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("UNAUTHENTICATED");
    }
    try {
      if (req.userId !== args.userId) {
        throw new Error("User not found");
      }
      const update_user = await User.findOneAndUpdate(
        { _id: args.userId },
        {
          $set: {
            firstName: args.firstName,
            lastName: args.lastName,
          },
        },
        { new: true },
        (err, User) => {
          if (err) {
            console.log("Something went wrong when updating the user");
          } else {
            console.log("User updated!");
          }
        }
      );

      return update_user;
    } catch (err) {
      throw err;
    }
  },
  updatePassword: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("UNAUTHENTICATED");
    }
    try {
      if (req.userId !== args.userId) {
        throw new Error("User not found");
      }
      if (args.password !== args.confirmPassword) {
        throw new Error("Passwords don't match");
      }
      const hashedPassword = await bcrypt.hash(args.password, 12);
      const update_user = await User.findOneAndUpdate(
        { _id: args.userId },
        {
          $set: {
            password: hashedPassword,
          },
        },
        { new: true },
        (err, User) => {
          if (err) {
            console.log("Something went wrong when updating the password");
          } else {
            console.log("Password updated!");
          }
        }
      );

      return update_user;
    } catch (err) {
      throw err;
    }
  },
  deleteAccount: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("UNAUTHENTICATED");
    }
    try {
      if (req.userId !== args.userId) {
        throw new Error("User not found");
      }

      const delete_user = await User.findById(args.userId).populate("user");
      await User.deleteOne({ _id: args.userId });
      if (!delete_user) {
        throw new Error(`Error, user not found  `);
      }
      return "Account deleted successfully";
    } catch (err) {
      throw err;
    }
  },
};
