const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");

module.exports = {
  RootMutation: {
    createUser: async (_, args) => {
      const { email, password } = args.userInput;
      try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
          throw new Error("User exists already.");
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
          email,
          password: hashedPassword
        });

        const result = await user.save();

        return { ...result._doc, _id: result.id };
      } catch (err) {
        throw err;
      }
    }
  },

  RootQuery: {
    login: async (_, args) => {
      const { email, password } = args.userInput;
      const user = await User.findOne({ email: email });
      if (!user) throw new Error("User does not exist!");
      const rightPassword = await bcrypt.compare(password, user.password);
      if (!rightPassword) throw new Error("Password is incorrect!");
      const token = jwt.sign({ userId: user.id, email: user.email }, "secret", {
        expiresIn: "1h"
      });
      return { userId: user.id, token: token, tokenExpiration: 1 };
    }
  }
};
