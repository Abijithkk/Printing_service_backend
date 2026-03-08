const SiteSettings = require("../../models/SiteSettings");
const { sendSuccess, sendError } = require("../../utils/apiResponse");
const { uploadToCloudinary, deleteFromCloudinary } = require("../../utils/fileHelper");


const getSiteSettings = async (req, res) => {
  try {
    const settings =
      (await SiteSettings.findOne()) || (await SiteSettings.create({}));
    return sendSuccess(res, "Site settings fetched", settings);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const updateLogo = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, "Logo file is required");
    }

    let settings = (await SiteSettings.findOne()) || new SiteSettings({});

    if (settings.logo) {
      await deleteFromCloudinary(settings.logo);
    }
    const uploadResult = await uploadToCloudinary(req.file.path, "logos");
    settings.logo = uploadResult.secure_url;

    const updated = await settings.save();
    return sendSuccess(res, "Logo updated successfully", updated);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const updateContactDetails = async (req, res) => {
  try {
    const { contactEmail, phoneNumber, officeAddress } = req.body;

    let settings = (await SiteSettings.findOne()) || new SiteSettings({});

    if (contactEmail !== undefined) settings.contactEmail = contactEmail;
    if (phoneNumber !== undefined) settings.phoneNumber = phoneNumber;
    if (officeAddress !== undefined) settings.officeAddress = officeAddress;

    const updated = await settings.save();
    return sendSuccess(res, "Contact details updated successfully", updated);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const updateFooterText = async (req, res) => {
  try {
    const { footerText } = req.body;

    let settings = (await SiteSettings.findOne()) || new SiteSettings({});

    if (footerText !== undefined) settings.footerText = footerText;

    const updated = await settings.save();
    return sendSuccess(res, "Footer text updated successfully", updated);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const addSocialMediaLink = async (req, res) => {
  try {
    const { link } = req.body;

    if (!req.file) {
      return sendError(res, "Icon file is required");
    }

    if (!link) {
      return sendError(res, "Link is required");
    }

    let settings = (await SiteSettings.findOne()) || new SiteSettings({});
    
    const uploadResult = await uploadToCloudinary(req.file.path, "social_media");
    const socialMediaItem = {
      icon: uploadResult.secure_url,
      link,
    };
    
    settings.socialMedia.push(socialMediaItem);

    const updated = await settings.save();
    return sendSuccess(res, "Social media link added", updated, 201);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const updateSocialMediaLink = async (req, res) => {
  try {
    const settings = await SiteSettings.findOne();
    if (!settings) return sendError(res, "Site settings not found", null, 404);

    const item = settings.socialMedia.id(req.params.id);
    if (!item) return sendError(res, "Social media link not found", null, 404);

    if (req.body.link !== undefined) item.link = req.body.link;
    
    if (req.file) {
      if (item.icon) {
        await deleteFromCloudinary(item.icon);
      }
      const uploadResult = await uploadToCloudinary(req.file.path, "social_media");
      item.icon = uploadResult.secure_url;
    }

    const updated = await settings.save();
    return sendSuccess(res, "Social media link updated", updated);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const deleteSocialMediaLink = async (req, res) => {
  try {
    const settings = await SiteSettings.findOne();
    if (!settings) return sendError(res, "Site settings not found", null, 404);

    const item = settings.socialMedia.id(req.params.id);
    if (!item) return sendError(res, "Social media link not found", null, 404);

    if (item.icon) {
      await deleteFromCloudinary(item.icon);
    }

    item.deleteOne();
    const updated = await settings.save();
    return sendSuccess(res, "Social media link deleted", updated);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

// update single header CTA stored in site settings
const updateHeaderCTA = async (req, res) => {
  try {
    const { text, link } = req.body;
    let settings = (await SiteSettings.findOne()) || new SiteSettings({});

    settings.headerCTA = settings.headerCTA || {};
    if (text !== undefined) settings.headerCTA.text = text;
    if (link !== undefined) settings.headerCTA.link = link;

    const updated = await settings.save();
    return sendSuccess(res, "Header CTA updated successfully", updated);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

module.exports = {
  getSiteSettings,
  updateLogo,
  updateContactDetails,
  updateFooterText,
  addSocialMediaLink,
  updateSocialMediaLink,
  deleteSocialMediaLink,
  updateHeaderCTA,
};
