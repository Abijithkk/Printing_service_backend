const Category = require("../../models/Category");
const { sendSuccess, sendError } = require("../../utils/apiResponse");
const {
  createCategorySchema,
  updateCategorySchema,
  reorderCategoriesSchema,
} = require("../../validators/categoryValidator");
const { uploadToCloudinary, deleteFromCloudinary } = require("../../utils/fileHelper");

const buildImageUrl = (req, value) => {
  if (!value) return value;
  if (typeof value !== "string") return value;
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  return `${baseUrl}${value}`;
};


const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort("order");
    const data = categories.map((category) => {
      const obj = category.toObject();
      obj.image = buildImageUrl(req, obj.image);
      return obj;
    });
    return sendSuccess(res, "Categories fetched successfully", data);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return sendError(res, "Category not found", null, 404);
    }

    const data = category.toObject();
    data.image = buildImageUrl(req, data.image);

    return sendSuccess(res, "Category fetched successfully", data);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { error } = createCategorySchema.validate(req.body);
    if (error) {
      return sendError(res, error.details[0].message, null, 400);
    }

    if (!req.file) {
      return sendError(res, "Category image is required", null, 400);
    }

    const { order, ...rest } = req.body;

    let finalOrder = order;
    if (finalOrder === undefined || finalOrder === null) {
      const lastCategory = await Category.findOne().sort({ order: -1 });
      finalOrder = lastCategory ? lastCategory.order + 1 : 1;
    }

    const uploadResult = await uploadToCloudinary(req.file.path, "categories");
    const imageUrl = uploadResult.secure_url;
    const category = new Category({
      ...rest,
      image: imageUrl,
      order: finalOrder,
    });
    await category.save();

    const data = category.toObject();
    data.image = buildImageUrl(req, data.image);

    return sendSuccess(res, "Category created successfully", data, 201);
  } catch (error) {
    if (error.code === 11000) {
      return sendError(
        res,
        "A category with this title already exists",
        null,
        400,
      );
    }
    return sendError(res, "Server error", { details: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { error } = updateCategorySchema.validate(req.body);
    if (error) {
      return sendError(res, error.details[0].message, null, 400);
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return sendError(res, "Category not found", null, 404);
    }

    if (req.file) {
      if (category.image) {
        await deleteFromCloudinary(category.image);
      }
      const uploadResult = await uploadToCloudinary(req.file.path, "categories");
      req.body.image = uploadResult.secure_url;
    }

    Object.assign(category, req.body);
    await category.save();

    const data = category.toObject();
    data.image = buildImageUrl(req, data.image);

    return sendSuccess(res, "Category updated successfully", data);
  } catch (error) {
    if (error.code === 11000) {
      return sendError(
        res,
        "A category with this title already exists",
        null,
        400,
      );
    }
    return sendError(res, "Server error", { details: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return sendError(res, "Category not found", null, 404);
    }

    if (category.image) {
      await deleteFromCloudinary(category.image);
    }

    await category.deleteOne();
    return sendSuccess(res, "Category deleted successfully");
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const toggleCategoryStatus = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return sendError(res, "Category not found", null, 404);
    }

    category.isActive = !category.isActive;
    await category.save();

    const data = category.toObject();
    data.image = buildImageUrl(req, data.image);

    return sendSuccess(res, "Category status toggled successfully", data);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const reorderCategories = async (req, res) => {
  try {
    const payload = Array.isArray(req.body)
      ? { items: req.body }
      : req.body;

    const { error } = reorderCategoriesSchema.validate(payload);
    if (error) {
      return sendError(res, error.details[0].message, null, 400);
    }

    const bulkOps = payload.items.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order },
      },
    }));

    await Category.bulkWrite(bulkOps);
    return sendSuccess(res, "Categories reordered successfully");
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  reorderCategories,
};
