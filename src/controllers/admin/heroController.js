const Hero = require("../../models/Hero");
const { BASE_URL } = require("../../config/env");
const { uploadToCloudinary, deleteFromCloudinary } = require("../../utils/fileHelper");

const getHero = async (req, res) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) {
      hero = await Hero.create({ sections: [] });
    }
    res.status(200).json({ success: true, data: hero });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createHero = async (req, res) => {
  try {
    const { headline, subtext, ctaText, ctaLink } = req.body;
    let backgroundImage = "";

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path, "hero");
      backgroundImage = uploadResult.secure_url;
    }

    let hero = await Hero.findOne();
    if (!hero) {
      hero = await Hero.create({ sections: [] });
    }

    hero.sections.push({
      headline,
      subtext,
      ctaText,
      ctaLink,
      backgroundImage,
    });

    await hero.save();

    res.status(201).json({
      success: true,
      message: "Hero section created successfully",
      data: hero,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateHero = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { headline, subtext, ctaText, ctaLink } = req.body;

    let hero = await Hero.findOne();
    if (!hero) {
      return res
        .status(404)
        .json({ success: false, message: "Hero not found." });
    }

    const section = hero.sections.id(sectionId);
    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "Hero section not found." });
    }


    if (req.file) {

      if (section.backgroundImage) {
        await deleteFromCloudinary(section.backgroundImage);
      }
      const uploadResult = await uploadToCloudinary(req.file.path, "hero");
      section.backgroundImage = uploadResult.secure_url;
    }

    section.headline = headline || section.headline;
    section.subtext = subtext || section.subtext;
    section.ctaText = ctaText || section.ctaText;
    section.ctaLink = ctaLink || section.ctaLink;

    await hero.save();

    res.status(200).json({
      success: true,
      message: "Hero section updated successfully",
      data: hero,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteHero = async (req, res) => {
  try {
    const { sectionId } = req.params;

    let hero = await Hero.findOne();
    if (!hero) {
      return res
        .status(404)
        .json({ success: false, message: "Hero not found." });
    }

    const section = hero.sections.id(sectionId);
    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "Hero section not found." });
    }


    if (section.backgroundImage) {
      await deleteFromCloudinary(section.backgroundImage);
    }

    section.remove();
    await hero.save();

    res.status(200).json({
      success: true,
      message: "Hero section deleted successfully",
      data: hero,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getHero, createHero, updateHero, deleteHero };
