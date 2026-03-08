const Highlight = require("../../models/Highlight");
const { sendSuccess, sendError } = require("../../utils/apiResponse");
const {
  createHighlightSchema,
  updateHighlightSchema,
  reorderHighlightsSchema,
} = require("../../validators/highlightValidator");
const { uploadToCloudinary, deleteFromCloudinary } = require("../../utils/fileHelper");

const formatHighlightResponse = (req, highlightDoc) => {
  if (!highlightDoc) return highlightDoc;

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const highlight = highlightDoc.toObject ? highlightDoc.toObject() : highlightDoc;

  if (highlight.icon && !highlight.icon.startsWith("http")) {
    highlight.icon = `${baseUrl}${highlight.icon}`;
  }

  return highlight;
};

const getHighlights = async (req, res) => {
  try {
    const highlightDocs = await Highlight.find().sort("order");
    const highlights = highlightDocs.map((h) => formatHighlightResponse(req, h));
    return sendSuccess(res, "Highlights fetched successfully", highlights);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const createHighlight = async (req, res) => {
  try {
    const { error } = createHighlightSchema.validate(req.body);
    if (error) {
      return sendError(res, error.details[0].message, null, 400);
    }

    if (!req.file) {
      return sendError(res, "Icon image is required", null, 400);
    }

    const { order, ...rest } = req.body;

    let finalOrder = order;
    if (finalOrder === undefined || finalOrder === null) {
      const lastHighlight = await Highlight.findOne().sort({ order: -1 });
      finalOrder = lastHighlight ? lastHighlight.order + 1 : 1;
    }

    const uploadResult = await uploadToCloudinary(req.file.path, "highlights");
    const iconUrl = uploadResult.secure_url;

    const highlight = new Highlight({
      ...rest,
      icon: iconUrl,
      order: finalOrder,
    });
    await highlight.save();

    const responseHighlight = formatHighlightResponse(req, highlight);
    return sendSuccess(
      res,
      "Highlight created successfully",
      responseHighlight,
      201,
    );
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const updateHighlight = async (req, res) => {
  try {
    const { error } = updateHighlightSchema.validate(req.body);
    if (error) {
      return sendError(res, error.details[0].message, null, 400);
    }

    const highlight = await Highlight.findById(req.params.id);
    if (!highlight) {
      return sendError(res, "Highlight not found", null, 404);
    }

    if (req.file) {
      if (highlight.icon) {
        await deleteFromCloudinary(highlight.icon);
      }

      const uploadResult = await uploadToCloudinary(req.file.path, "highlights");
      req.body.icon = uploadResult.secure_url;
    }

    Object.assign(highlight, req.body);
    await highlight.save();

    const responseHighlight = formatHighlightResponse(req, highlight);
    return sendSuccess(
      res,
      "Highlight updated successfully",
      responseHighlight,
    );
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const deleteHighlight = async (req, res) => {
  try {
    const highlight = await Highlight.findById(req.params.id);
    if (!highlight) {
      return sendError(res, "Highlight not found", null, 404);
    }

    if (highlight.icon) {
      await deleteFromCloudinary(highlight.icon);
    }

    await highlight.deleteOne();
    return sendSuccess(res, "Highlight deleted successfully");
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const toggleHighlightStatus = async (req, res) => {
  try {
    const highlight = await Highlight.findById(req.params.id);
    if (!highlight) {
      return sendError(res, "Highlight not found", null, 404);
    }

    highlight.isActive = !highlight.isActive;
    await highlight.save();

    const responseHighlight = formatHighlightResponse(req, highlight);
    return sendSuccess(
      res,
      "Highlight status toggled successfully",
      responseHighlight,
    );
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const reorderHighlights = async (req, res) => {
  try {
    const payload = Array.isArray(req.body)
      ? { items: req.body }
      : req.body;

    const { error } = reorderHighlightsSchema.validate(payload);
    if (error) {
      return sendError(res, error.details[0].message, null, 400);
    }

    const bulkOps = payload.items.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order },
      },
    }));

    await Highlight.bulkWrite(bulkOps);
    return sendSuccess(res, "Highlights reordered successfully");
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

module.exports = {
  getHighlights,
  createHighlight,
  updateHighlight,
  deleteHighlight,
  toggleHighlightStatus,
  reorderHighlights,
};
