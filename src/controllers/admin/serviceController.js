const Service = require("../../models/Service");
const { sendSuccess, sendError } = require("../../utils/apiResponse");
const {
  createServiceSchema,
  updateServiceSchema,
  reorderServicesSchema,
} = require("../../validators/serviceValidator");
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


const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort("order");
    const data = services.map((service) => {
      const obj = service.toObject();
      obj.image = buildImageUrl(req, obj.image);
      return obj;
    });
    return sendSuccess(res, "Services fetched successfully", data);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const createService = async (req, res) => {
  try {
    const { error } = createServiceSchema.validate(req.body);
    if (error) {
      return sendError(res, error.details[0].message, null, 400);
    }

    if (!req.file) {
      return sendError(res, "Service image is required", null, 400);
    }

    const { order, ...rest } = req.body;

    let finalOrder = order;
    if (finalOrder === undefined || finalOrder === null) {
      const lastService = await Service.findOne().sort({ order: -1 });
      finalOrder = lastService ? lastService.order + 1 : 1;
    }

    const uploadResult = await uploadToCloudinary(req.file.path, "services");
    const imageUrl = uploadResult.secure_url;
    const service = new Service({
      ...rest,
      image: imageUrl,
      order: finalOrder,
    });
    await service.save();

    const data = service.toObject();
    data.image = buildImageUrl(req, data.image);

    return sendSuccess(res, "Service created successfully", data, 201);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const { error } = updateServiceSchema.validate(req.body);
    if (error) {
      return sendError(res, error.details[0].message, null, 400);
    }

    const service = await Service.findById(req.params.id);
    if (!service) {
      return sendError(res, "Service not found", null, 404);
    }

    if (req.file) {
      if (service.image) {
        await deleteFromCloudinary(service.image);
      }
      const uploadResult = await uploadToCloudinary(req.file.path, "services");
      req.body.image = uploadResult.secure_url;
    }

    Object.assign(service, req.body);
    await service.save();

    const data = service.toObject();
    data.image = buildImageUrl(req, data.image);

    return sendSuccess(res, "Service updated successfully", data);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return sendError(res, "Service not found", null, 404);
    }

    if (service.image) {
      await deleteFromCloudinary(service.image);
    }

    await service.deleteOne();
    return sendSuccess(res, "Service deleted successfully");
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const toggleServiceStatus = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return sendError(res, "Service not found", null, 404);
    }

    service.isActive = !service.isActive;
    await service.save();

    const data = service.toObject();
    data.image = buildImageUrl(req, data.image);

    return sendSuccess(res, "Service status toggled successfully", data);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const reorderServices = async (req, res) => {
  try {
    const payload = Array.isArray(req.body)
      ? { items: req.body }
      : req.body;

    const { error } = reorderServicesSchema.validate(payload);
    if (error) {
      return sendError(res, error.details[0].message, null, 400);
    }

    const bulkOps = payload.items.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order },
      },
    }));

    await Service.bulkWrite(bulkOps);
    return sendSuccess(res, "Services reordered successfully");
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
  reorderServices,
};
