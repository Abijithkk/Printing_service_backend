const SiteSettings = require("../../models/SiteSettings");
const Navigation = require("../../models/Navigation");
const CTAButton = require("../../models/CTAButton");
const { sendSuccess, sendError } = require("../../utils/apiResponse");

const getHeaderSettings = async (req, res) => {
  try {
    const settings =
      (await SiteSettings.findOne()) ||
      (await SiteSettings.create({ logoUrl: "" }));
    return sendSuccess(res, "Header settings fetched", settings);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const updateHeaderSettings = async (req, res) => {
  try {
    const {
      logoUrl,
      searchIconEnabled,
      cartIconEnabled,
      userIconEnabled,
      headerCTA,
    } = req.body;
    let settings = await SiteSettings.findOne();

    if (settings) {
      settings.logoUrl = logoUrl !== undefined ? logoUrl : settings.logoUrl;
      settings.searchIconEnabled =
        searchIconEnabled !== undefined
          ? searchIconEnabled
          : settings.searchIconEnabled;
      settings.cartIconEnabled =
        cartIconEnabled !== undefined
          ? cartIconEnabled
          : settings.cartIconEnabled;
      settings.userIconEnabled =
        userIconEnabled !== undefined
          ? userIconEnabled
          : settings.userIconEnabled;

      if (headerCTA) {
        settings.headerCTA = {
          text:
            headerCTA.text !== undefined
              ? headerCTA.text
              : settings.headerCTA.text,
          link:
            headerCTA.link !== undefined
              ? headerCTA.link
              : settings.headerCTA.link,
        };
      }

      const updatedSettings = await settings.save();
      return sendSuccess(res, "Header settings updated", updatedSettings);
    } else {
      settings = await SiteSettings.create({
        logoUrl,
        searchIconEnabled,
        cartIconEnabled,
        userIconEnabled,
        headerCTA: headerCTA || {},
      });
      return sendSuccess(res, "Header settings created", settings, 201);
    }
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};


const getNavigationItems = async (req, res) => {
  try {
    const navItems = await Navigation.find().sort("order");
    return sendSuccess(res, "Navigation items fetched", navItems);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const createNavigationItem = async (req, res) => {
  try {
    const { title, order, isActive } = req.body;

    let finalOrder = order;
    if (finalOrder === undefined || finalOrder === null) {
      const lastItem = await Navigation.findOne().sort({ order: -1 });
      finalOrder = lastItem ? lastItem.order + 1 : 1;
    }

    const navItem = await Navigation.create({ title, order: finalOrder, isActive });
    return sendSuccess(res, "Navigation item created", navItem, 201);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const updateNavigationItem = async (req, res) => {
  try {
    const navItem = await Navigation.findById(req.params.id);
    if (!navItem) {
      return sendError(res, "Navigation item not found", null, 404);
    }

    const { title, order, isActive } = req.body;
    navItem.title = title || navItem.title;
    navItem.order = order !== undefined ? order : navItem.order;
    navItem.isActive = isActive !== undefined ? isActive : navItem.isActive;

    const updatedNavItem = await navItem.save();
    return sendSuccess(res, "Navigation item updated", updatedNavItem);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const deleteNavigationItem = async (req, res) => {
  try {
    const navItem = await Navigation.findById(req.params.id);
    if (!navItem) {
      return sendError(res, "Navigation item not found", null, 404);
    }
    await navItem.deleteOne();
    return sendSuccess(res, "Navigation item removed");
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const toggleActiveNavigationItem = async (req, res) => {
  try {
    const navItem = await Navigation.findById(req.params.id);
    if (!navItem) {
      return sendError(res, "Navigation item not found", null, 404);
    }
    navItem.isActive = !navItem.isActive;
    const updatedNavItem = await navItem.save();
    return sendSuccess(res, "Navigation item status updated", updatedNavItem);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const reorderNavigationItems = async (req, res) => {
  try {
    const items = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return sendError(
        res,
        "Invalid data format. Expected an array of items with id and order.",
        null,
        400,
      );
    }

    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order },
      },
    }));

    await Navigation.bulkWrite(bulkOps);

    const allItems = await Navigation.find().sort({ order: 1 });
    return sendSuccess(res, "Navigation items reordered successfully", allItems);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const getCTAButtons = async (req, res) => {
  try {
    const ctas = await CTAButton.find().sort("-createdAt");
    return sendSuccess(res, "CTA buttons fetched", ctas);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const createCTAButton = async (req, res) => {
  try {
    const { text, link, isActive } = req.body;
    if (!text || !link) {
      return sendError(res, "text and link are required", null, 400);
    }

    const cta = await CTAButton.create({
      text,
      link,
      isActive,
    });

    return sendSuccess(res, "CTA button created", cta, 201);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const getCTAButtonById = async (req, res) => {
  try {
    const cta = await CTAButton.findById(req.params.id);
    if (!cta) {
      return sendError(res, "CTA button not found", null, 404);
    }
    return sendSuccess(res, "CTA button fetched", cta);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const updateCTAButtonById = async (req, res) => {
  try {
    const { text, link, isActive } = req.body;
    const cta = await CTAButton.findById(req.params.id);
    if (!cta) {
      return sendError(res, "CTA button not found", null, 404);
    }

    cta.text = text || cta.text;
    cta.link = link || cta.link;
    cta.isActive = isActive !== undefined ? isActive : cta.isActive;

    const updatedCTA = await cta.save();
    return sendSuccess(res, "CTA button updated", updatedCTA);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const deleteCTAButton = async (req, res) => {
  try {
    const cta = await CTAButton.findById(req.params.id);
    if (!cta) {
      return sendError(res, "CTA button not found", null, 404);
    }

    await cta.deleteOne();
    return sendSuccess(res, "CTA button removed");
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const toggleCTAButtonStatus = async (req, res) => {
  try {
    const cta = await CTAButton.findById(req.params.id);
    if (!cta) {
      return sendError(res, "CTA button not found", null, 404);
    }

    cta.isActive = !cta.isActive;
    const updatedCTA = await cta.save();
    return sendSuccess(res, "CTA button status updated", updatedCTA);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

module.exports = {
  getHeaderSettings,
  updateHeaderSettings,
  getNavigationItems,
  createNavigationItem,
  updateNavigationItem,
  deleteNavigationItem,
  toggleActiveNavigationItem,
  reorderNavigationItems,
  getCTAButtons,
  createCTAButton,
  getCTAButtonById,
  updateCTAButtonById,
  deleteCTAButton,
  toggleCTAButtonStatus,
};
