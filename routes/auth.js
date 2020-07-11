const { Router } = require("express");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator/check");
const mailgun = require("mailgun-js");

const User = require("../models/user");
const { MAILGUN_API_KEY, MAILGUN_DOMAIN } = require("../keys");
const regEmail = require("../emails/registration");
const mg = mailgun({ apiKey: MAILGUN_API_KEY, domain: MAILGUN_DOMAIN });
const { registerValidators } = require("../utils/validators");
const router = Router();

router.get("/login", async (req, res) => {
  res.render("auth/login", {
    title: "Auth",
    isLogin: true,
    loginError: req.flash("loginError"),
    registerError: req.flash("registerError"),
  });
});

router.get("/logout", async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login#login");
  });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password);

      if (areSame) {
        const user = candidate;
        req.session.user = user;
        req.session.isAuthenticated = true;
        req.session.save((err) => {
          if (err) {
            throw err;
          }
          res.redirect("/");
        });
      } else {
        req.flash("loginError", "Incorrect email or password");
        res.redirect("/auth/login#login");
      }
    } else {
      req.flash("loginError", "Incorrect email or password");
      res.redirect("/auth/login#login");
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/register", registerValidators, async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash("registerError", errors.array()[0].msg);
      return res.status(422).redirect("/auth/login#register");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashPassword,
      name,
      cart: {
        items: [],
      },
    });
    await user.save();
    await mg.messages().send(regEmail(email), function (error, body) {
      console.log(body);
    });
    res.redirect("/auth/login#login");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
