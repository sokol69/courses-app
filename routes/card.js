const { Router } = require("express");
const Card = require("../models/card");
const Course = require("../models/course");

const router = Router();

router.post("/add", async (req, res) => {
  const course = await Course.getById(req.body.id);
  await Card.add(course);
  res.redirect("/card");
});

router.get("/", async (req, res) => {
  const card = await Course.fetch();
  res.render("card", {
    title: "Card",
    card,
  });
});

module.exports = router;
