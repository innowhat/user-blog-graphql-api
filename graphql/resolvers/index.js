const userResolver = require("./user");
const postResolver = require("./posts");

const rootResolver = {
  ...userResolver,
  ...postResolver,
};

module.exports = rootResolver;
