const multer = require("multer");
const path = require("path");
const fs = require("fs");

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/logos");
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `logo-${Date.now()}${ext}`);
  },
});

const logoFileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|svg/;
  const validExt = allowed.test(path.extname(file.originalname).toLowerCase());
  const validMime = allowed.test(file.mimetype);
  if (validExt && validMime) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, jpg, png, webp, svg) are allowed"));
  }
};

const uploadLogo = multer({
  storage: logoStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: logoFileFilter,
}).single("logo");

const heroStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/hero");
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `hero-${Date.now()}${ext}`);
  },
});

const heroFileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|svg/;
  const validExt = allowed.test(path.extname(file.originalname).toLowerCase());
  const validMime = allowed.test(file.mimetype);
  if (validExt && validMime) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, jpg, png, webp, svg) are allowed"));
  }
};

const uploadHeroImage = multer({
  storage: heroStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: heroFileFilter,
}).single("backgroundImage");

const highlightIconStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/highlights");
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `highlight-${Date.now()}${ext}`);
  },
});

const highlightIconFileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|svg/;
  const validExt = allowed.test(path.extname(file.originalname).toLowerCase());
  const validMime = allowed.test(file.mimetype);
  if (validExt && validMime) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, jpg, png, webp, svg) are allowed"));
  }
};

const uploadHighlightIcon = multer({
  storage: highlightIconStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: highlightIconFileFilter,
}).single("icon");

const categoryImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/categories");
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `category-${Date.now()}${ext}`);
  },
});

const categoryImageFileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|svg/;
  const validExt = allowed.test(path.extname(file.originalname).toLowerCase());
  const validMime = allowed.test(file.mimetype);
  if (validExt && validMime) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, jpg, png, webp, svg) are allowed"));
  }
};

const uploadCategoryImage = multer({
  storage: categoryImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: categoryImageFileFilter,
}).single("image");

const serviceImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/services");
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `service-${Date.now()}${ext}`);
  },
});

const serviceImageFileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|svg/;
  const validExt = allowed.test(path.extname(file.originalname).toLowerCase());
  const validMime = allowed.test(file.mimetype);
  if (validExt && validMime) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, jpg, png, webp, svg) are allowed"));
  }
};

const uploadServiceImage = multer({
  storage: serviceImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: serviceImageFileFilter,
}).single("image");

const socialMediaIconStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/social-media");
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `social-${Date.now()}${ext}`);
  },
});

const socialMediaIconFileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|svg|gif/;
  const validExt = allowed.test(path.extname(file.originalname).toLowerCase());
  const validMime = allowed.test(file.mimetype);
  if (validExt && validMime) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, jpg, png, webp, svg, gif) are allowed"));
  }
};

const uploadSocialMediaIcon = multer({
  storage: socialMediaIconStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: socialMediaIconFileFilter,
}).single("icon");

module.exports = {
  uploadLogo,
  uploadHeroImage,
  uploadHighlightIcon,
  uploadCategoryImage,
  uploadServiceImage,
  uploadSocialMediaIcon,
};
