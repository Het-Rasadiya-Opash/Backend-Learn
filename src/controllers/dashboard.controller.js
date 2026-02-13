import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const totalVideos = await Video.countDocuments({ owner: channelId });

  const totalSubscribers = await Subscription.countDocuments({
    channel: channelId,
  });

  const totalLikes = await Like.countDocuments({
    video: { $in: await Video.find({ owner: channelId }).select("_id") },
  });

  const totalViews = await Video.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(channelId) } },
    { $group: { _id: null, totalViews: { $sum: "$views" } } },
  ]);

  const stats = {
    totalVideos,
    totalSubscribers,
    totalLikes,
    totalViews: totalViews[0] ? totalViews[0].totalViews : 0,
  };

  res
    .status(200)
    .json(new ApiResponse(200, stats, "Channel stats fetched successfully"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const videos = await Video.find({
    owner: new mongoose.Types.ObjectId(channelId),
  }).sort({
    createdAt: -1,
  });
  if (!videos) {
    throw new ApiError(404, "No videos found for this channel");
  }
  res
    .status(200)
    .json(new ApiResponse(true, "Channel videos fetched successfully", videos));
});

export { getChannelStats, getChannelVideos };
