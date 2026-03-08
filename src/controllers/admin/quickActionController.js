const QuickAction = require("../../models/QuickAction");
const { sendSuccess, sendError } = require("../../utils/apiResponse");
const {
  createQuickActionSchema,
  updateQuickActionSchema,
  reorderQuickActionsSchema,
} = require("../../validators/quickActionValidator");

const getQuickActions = async (req, res) => {
  try {
    const quickActions = await QuickAction.find().sort("order");
    return sendSuccess(res, "Quick actions fetched successfully", quickActions);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const createQuickAction = async (req, res) => {
  try {
    const { error } = createQuickActionSchema.validate(req.body);
    if (error) {
      return sendError(res, error.details[0].message, null, 400);
    }

    const { order, ...rest } = req.body;

    let finalOrder = order;
    if (finalOrder === undefined || finalOrder === null) {
      const lastQuickAction = await QuickAction.findOne().sort({ order: -1 });
      finalOrder = lastQuickAction ? lastQuickAction.order + 1 : 1;
    }

    const quickAction = new QuickAction({
      ...rest,
      order: finalOrder,
    });
    await quickAction.save();

    return sendSuccess(
      res,
      "Quick action created successfully",
      quickAction,
      201,
    );
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const updateQuickAction = async (req, res) => {
  try {
    const { error } = updateQuickActionSchema.validate(req.body);
    if (error) {
      return sendError(res, error.details[0].message, null, 400);
    }

    const quickAction = await QuickAction.findById(req.params.id);
    if (!quickAction) {
      return sendError(res, "QuickAction not found", null, 404);
    }

    Object.assign(quickAction, req.body);
    await quickAction.save();

    return sendSuccess(res, "Quick action updated successfully", quickAction);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const deleteQuickAction = async (req, res) => {
  try {
    const quickAction = await QuickAction.findById(req.params.id);
    if (!quickAction) {
      return sendError(res, "QuickAction not found", null, 404);
    }

    await quickAction.deleteOne();
    return sendSuccess(res, "Quick action deleted successfully");
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const toggleQuickActionStatus = async (req, res) => {
  try {
    const quickAction = await QuickAction.findById(req.params.id);
    if (!quickAction) {
      return sendError(res, "QuickAction not found", null, 404);
    }

    quickAction.isActive = !quickAction.isActive;
    await quickAction.save();

    return sendSuccess(
      res,
      "Quick action status toggled successfully",
      quickAction,
    );
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const reorderQuickActions = async (req, res) => {
  try {
    const payload = Array.isArray(req.body)
      ? { items: req.body }
      : req.body;

    const { error } = reorderQuickActionsSchema.validate(payload);
    if (error) {
      return sendError(res, error.details[0].message, null, 400);
    }

    const bulkOps = payload.items.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order },
      },
    }));

    await QuickAction.bulkWrite(bulkOps);
    return sendSuccess(res, "Quick actions reordered successfully");
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

module.exports = {
  getQuickActions,
  createQuickAction,
  updateQuickAction,
  deleteQuickAction,
  toggleQuickActionStatus,
  reorderQuickActions,
};
