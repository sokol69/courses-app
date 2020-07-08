const { Router } = require("express");
const User = require("../models/user");
const router = Router();

router.get("/login", async (req, res) => {
  res.render("auth/login", {
    title: "Auth",
    isLogin: true,
  });
});

router.get("/logout", async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login#login");
  });
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findById("5efeb767cb21a38f8ddcee33");
    req.session.user = user;
    req.session.isAuthenticated = true;
    req.session.save((err) => {
      if (err) {
        throw err;
      }
      res.redirect("/");
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
