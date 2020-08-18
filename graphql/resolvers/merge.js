const DataLoader = require("dataloader");

const User = require("../../models/user");
const Post = require("../../models/post");

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});

const postLoader = new DataLoader((postIds) => {
  return posts(postIds);
});

const user = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      _id: user.id,
      createdPosts: () => postLoader.loadMany(user._doc.createdPosts),
    };
  } catch (err) {
    throw err;
  }
};

const posts = async (postIds) => {
  try {
    const posts = await Post.find({ _id: { $in: postIds } });
    posts.sort((a, b) => {
      return (
        postIds.indexOf(a._id.toString()) - postIds.indexOf(b._id.toString())
      );
    });
    return posts.map((post) => {
      return transformPost(post);
    });
  } catch (err) {
    throw err;
  }
};

const transformPost = (post) => {
  return {
    ...post._doc,
    _id: post.id,
    author: user.bind(this, post.author),
  };
};

exports.transformPost = transformPost;
