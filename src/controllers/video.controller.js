import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 10;

  const filter = { isPublished: true };

  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  if (userId && userId !== "undefined" && isValidObjectId(userId)) {
    filter.owner = userId;
  }

  const allowedSortFields = ["createdAt", "views", "title"];
  const sortOptions = {};

  if (sortBy && allowedSortFields.includes(sortBy)) {
    sortOptions[sortBy] = sortType === "desc" ? -1 : 1;
  } else {
    sortOptions.createdAt = -1;
  }

  const videos = await Video.find(filter)
    .sort(sortOptions)
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber)
    .populate("owner", "username email");

  const total = await Video.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        videos,
        total,
        page: pageNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
      "Videos fetched successfully"
    )
  );
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title?.trim() || !description?.trim()) {
    throw new ApiError(400, "Title and Description are required");
  }

  if (!req.files?.videoFile?.[0] || !req.files?.thumbnail?.[0]) {
    throw new ApiError(400, "Video file and thumbnail are required");
  }

  const videoFile = req.files.videoFile[0];
  const thumbnailFile = req.files.thumbnail[0];
  const [videoUploadResult, thumbnailUploadResult] = await Promise.all([
    uploadOnCloudinary(videoFile.path),
    uploadOnCloudinary(thumbnailFile.path),
  ]);

  if (!videoUploadResult || !thumbnailUploadResult) {
    throw new ApiError(500, "Failed to upload video or thumbnail");
  }
  const video = await Video.create({
    title,
    description,
    videoFile: videoUploadResult.url,
    thumbnail: thumbnailUploadResult.url,
    owner: req.user._id,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }
  const video = await Video.findByIdAndUpdate(
    videoId,
    { $inc: { views: 1 } },
    { new: true }
  ).populate("owner", "username email");
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (
    !video.isPublished &&
    video.owner._id.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "You are not authorized to view this video");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this video");
  }
  const { title, description } = req.body;
  if (title) {
    video.title = title;
  }
  if (description) {
    video.description = description;
  }
  if (req.files?.thumbnail?.[0]) {
    const thumbnailUploadResult = await uploadOnCloudinary(req.files.thumbnail[0].path);
    if (!thumbnailUploadResult) {
      throw new ApiError(500, "Failed to upload thumbnail");
    }
    video.thumbnail = thumbnailUploadResult.url;
  }
  await video.save();
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this video");
  }
  await Video.deleteOne({ _id: videoId });
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to toggle publish status of this video"
    );
  }
  video.isPublished = !video.isPublished;
  await video.save();
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Publish status toggled successfully"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
