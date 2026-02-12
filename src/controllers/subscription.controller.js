import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }
  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  const subscriberId = req.user._id;
  const existingSubscription = await Subscription.findOne({
    subscriber: subscriberId,
    channel: channelId,
  });
  if (existingSubscription) {
    await existingSubscription.deleteOne({ _id: existingSubscription._id });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Unsubscribed successfully"));
  }
  const newSubscription = await Subscription.create({
    subscriber: subscriberId,
    channel: channelId,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, newSubscription, "Subscribed successfully"));
});

//HOW MANY USER SUBSCRIBED TO A CHANNEL
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }
  const subscribers = await Subscription.find({ channel: channelId }).populate(
    "subscriber",
    "username email"
  );
  return res
    .status(200)
    .json(
      new ApiResponse(200, subscribers, "Subscribers fetched successfully")
    );
});

//GET ALL CHANNELS A USER IS SUBSCRIBED TO
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber ID");
  }
  const subscriptions = await Subscription.find({
    subscriber: subscriberId,
  }).populate("channel", "username email");
  const channels = subscriptions.map((sub) => sub.channel);
  return res
    .status(200)
    .json(
      new ApiResponse(200, channels, "Subscribed channels fetched successfully")
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
