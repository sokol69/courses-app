const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Handlebars = require("handlebars");
const ehbs = require("express-handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const homeRoutes = require("./routes/home");
const coursesRoutes = require("./routes/courses");
const addRoutes = require("./routes/add");
const cardRoutes = require("./routes/card");
const User = require("./models/user");

const app = express();

const hbs = ehbs.create({
  defaultLayout: "main",
  extname: "hbs",
});

const PORT = process.env.PORT || 3000;

app.engine(
  "handlebars",
  ehbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("view engine", "handlebars");
app.set("views", "views");

app.use(async (req, res, next) => {
  try {
    const user = await User.findById("5efeb767cb21a38f8ddcee33");
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
  }
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use("/", homeRoutes);
app.use("/courses", coursesRoutes);
app.use("/add", addRoutes);
app.use("/card", cardRoutes);

async function start() {
  try {
    const url =
      "mongodb+srv://dmitry:j8man2Svb9YBuH11@cluster0.nrxjo.mongodb.net/shop";
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    const candidate = await User.findOne();

    if (!candidate) {
      const user = new User({
        email: "dmitry@maul.ru",
        name: "Dmitry",
        cart: { items: [] },
      });

      await user.save();
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
