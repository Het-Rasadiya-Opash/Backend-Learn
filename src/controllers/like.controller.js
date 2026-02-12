import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "Invalid video ID");
  }
  const isVideo = await Video.findById(videoId);
  if (!isVideo) {
    throw new ApiError(404, "Video not found");
  }
  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });

  if (existingLike) {
    await Like.deleteOne({ _id: existingLike._id });
    return res.status(200).json(new ApiResponse(true, "Video unliked"));
  }
  const newLike = await Like.create({
    video: videoId,
    likedBy: req.user._id,
  });
  res.status(200).json(new ApiResponse(true, "Video liked"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(400, "Invalid comment ID");
  }
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });
  if (existingLike) {
    await Like.deleteOne({ _id: existingLike._id });
    return res.json(new ApiResponse(true, "Comment unliked"));
  }
  const newLike = await Like.create({
    comment: commentId,
    likedBy: req.user._id,
  });
  res.json(new ApiResponse(true, "Comment liked"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!tweetId) {
    throw new ApiError(400, "Invalid tweet ID");
  }
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }
  const existingLike = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user._id,
  });
  if (existingLike) {
    await Like.deleteOne({ _id: existingLike._id });
    return res.status(200).json(new ApiResponse(true, "Tweet unliked"));
  }
  const newLike = await Like.create({
    tweet: tweetId,
    likedBy: req.user._id,
  });
  res.status(200).json(new ApiResponse(true, "Tweet liked"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const likedVideos = await Like.find({
    likedBy: req.user._id,
    video: { $ne: null },
  })
    .populate("video", "title description url")
    .exec();
  const videos = likedVideos.map((like) => like.video);
  res.status(200).json(new ApiResponse(true, "Liked videos retrieved", videos));
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
