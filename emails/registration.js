const { EMAIL_FROM } = require("../keys");

module.exports = function (email) {
  return {
    from: EMAIL_FROM,
    to: email,
    subject: "Registration",
    text: "Account was created",
  };
};
