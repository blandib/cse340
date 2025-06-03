const utilities = require("../utilities");

const baseController = {};

baseController.buildHome = async function (req, res) {
  let nav = await utilities.getNav();
  req.flash("notice", "This is a flash message.");
  res.render("index", {
    title: "Home",
    nav,
    messages: req.flash() 
  });
};

module.exports = baseController;
