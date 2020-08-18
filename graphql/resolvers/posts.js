const Post = require("../../models/post");
const User = require("../../models/user");

const { transformPost } = require("./merge");

module.exports = {
  getAllPosts: async () => {
    try {
      const events = await Post.find({ published: true });
      return events.map((post) => {
        return transformPost(post);
      });
    } catch (err) {
      throw err;
    }
  },

  getMyPosts: async (args, req) => {
    try {
      const posts = await Post.find({ author: req.userId });
      return posts.map((post) => {
        return transformPost(post);
      });
    } catch (err) {
      throw err;
    }
  },
  getMyPostsById: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("UNAUTHENTICATED");
    }
    try {
      const posts = await Post.find({
        author: req.userId,
        _id: args.postId,
      });
      return posts.map((post) => {
        return transformPost(post);
      });
    } catch (err) {
      throw err;
    }
  },
  createPost: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("UNAUTHENTICATED");
    }
    const post = new Post({
      author: req.userId,
      title: args.input.title,
      body: args.input.body,
      published: args.input.published,
    });
    let createdPost;
    try {
      const result = await post.save();
      createdPost = transformPost(result);
      const author = await User.findById(req.userId);

      if (!author) {
        throw new Error("User not found.");
      }
      // author.createdPosts.push(post);
      await author.save();

      return createdPost;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  updatePost: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("UNAUTHENTICATED");
    }
    try {
      //if (!args.postId) return;
      const update_post = await Post.findOneAndUpdate(
        { _id: args.postId },
        { $set: args.input },
        { new: true },
        (err, Post) => {
          if (err) {
            console.log("Something went wrong when updating the post");
          } else {
          }
        }
      );
      return update_post;
    } catch (err) {
      throw err;
    }
  },
  deletePost: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("UNAUTHENTICATED");
    }
    try {
      const delete_post = await Post.findById(args.postId).populate("post");
      await Post.deleteOne({ _id: args.postId });
      if (!delete_post) {
        throw new Error(`Error, post not found  `);
      }
      return "Post deleted successfully";
    } catch (err) {
      throw err;
    }
  },
};
