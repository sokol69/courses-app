const { body } = require("express-validator/check");

const User = require("../models/user");

exports.registerValidators = [
  body("email")
    .isEmail()
    .withMessage("Incorrect Email")
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("User with this email already exists");
        }
      } catch (error) {
        console.log(error);
      }
    })
    .normalizeEmail(),
  body("password", "Incorrect password")
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),
  body("confirm")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords must be equals");
      }
      return true;
    })
    .trim(),
  body("name").isLength({ min: 3 }).withMessage("Incorrect Name"),
];
