import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Url } from "../models/url.model.js";
import { generateShortCode } from "../utils/generateShortCode.js";

const createShortUrl = asyncHandler(async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    throw new ApiError(400, "Not valid url");
  }

  const shortCode = await generateShortCode();
  const url = await Url.create({
    originalUrl,
    shortCode,
    user: req.user._id,
  });

  const shortUrl = `${process.env.BASE_URL || ""}/${url.shortCode}`;

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        originalUrl,
        shortCode,
        shortUrl,
      },
      "Short url created successfully"
    )
  );
});

const getUrls = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const urls = await Url.find({ user: userId }).sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, urls, "User URLs fetched successfully"));
});

const redirectUrl = asyncHandler(async (req, res) => {
  const { shortCode } = req.params;

  if (!shortCode) {
    throw new ApiError(400, "Short code is required");
  }

  const url = await Url.findOne({ shortCode });

  if (!url) {
    throw new ApiError(404, "Short Url not found");
  }

  url.clicks += 1;
  await url.save();

  return res.redirect(url.originalUrl);
});

const getUrl = asyncHandler(async (req, res) => {
  const { shortCode } = req.params;

  const userId = req.user._id;

  if (!shortCode) {
    throw new ApiError(400, "Short code is required");
  }

  const url = await Url.findOne({ shortCode, user: userId });

  if (!url) {
    throw new ApiError(404, "Url not found");
  }

  return res.status(200).json(new ApiResponse(200, url));
});

const updateUrl = asyncHandler(async (req, res) => {
  const { shortCode } = req.params;
  const { originalUrl } = req.body;
  const userId = req.user._id;

  if (!shortCode) {
    throw new ApiError(400, "Short code is required");
  }

  if (!originalUrl) {
    throw new ApiError(400, "Original url is required");
  }

  const url = await Url.findOne({
    shortCode,
  });

  if (!url) {
    throw new ApiError(404, "Url not found");
  }

  if (!url.user.equals(userId)) {
    throw new ApiError(403, "unauthorized access");
  }

  url.originalUrl = originalUrl;

  await url.save();

  return res
    .status(200)
    .json(new ApiResponse(200, url, "Url updated Successfully"));
});

const deleteurl = asyncHandler(async (req, res) => {
  const { shortCode } = req.params;
  const userId = req.user._id;
  if (!shortCode) {
    throw new ApiError(400, "Short code is required");
  }
  const url = await Url.findOneAndDelete({ shortCode, user: userId });
  if (!url) {
    throw new ApiError(404, "URL not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "URL deleted successfully"));
});

export { getUrls, createShortUrl, redirectUrl, getUrl, updateUrl, deleteurl };
