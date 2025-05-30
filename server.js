/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const staticRoutes = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities/index");



/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); 
app.use(staticRoutes);

/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"));
app.get("/", baseController.buildHome);
app.use("/inv", require("./routes/inventoryRoute"));
//app.use(static)
// Inventory routes
//app.use("/inv", inventoryRoute)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'});
});
/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
/*app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})*/
app.use((err, req, res, next) => {
  utilities.getNav().then(nav => {
    console.error(`Error at: "${req.originalUrl}": ${err.message}`);
    
    const message = err.status == 404 
      ? err.message 
      : 'Oh no! There was a crash. Maybe try a different route?';

    res.status(err.status || 500).render("errors/error", {
      title: err.status || 'Server Error',
      message,
      errorDetails: err.message, 
      nav
    });
  }).catch(error => {
    console.error("Navigation generation failed: " + error);
    res.status(500).render("errors/error", {
      title: "Server Error",
      message: "An unexpected error occurred. Please try again later.",
      errorDetails: error.message, 
      nav: ''
    });
  });
});

app.use((req, res, next) => {
    res.status(404).render("errors/error", {
        title: "404 Error",
        message: "Oops! The page you are looking for does not exist.",
        nav: ''
    });
});

app.use((req, res, next) => {
    res.status(404).render("error", { title: "404 Error", message: "Page not found!" });
});


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

//index route

//app.get("/", baseController.buildHome)
app.get("/", utilities.handleErrors(baseController.buildHome));

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
app.use(express.static("public"));

