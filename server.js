/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const accountRoute = require("./routes/accountRoute")
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const staticRoutes = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities/index");
const bodyParser = require("body-parser");




/* ***********************
 * Middleware
 * ************************/
const session = require("express-session")
const flash = require("connect-flash")
const messages = require("express-messages")
const pool = require("./database")

app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: "sessionId",
    cookie: { maxAge: 1000 * 60 * 60 * 2 },
  })
)

app.use(flash())

app.use((req, res, next) => {
  res.locals.messages = messages(req, res)
  next()
})
app.use(express.urlencoded({ extended: true }))
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
app.use("/account", accountRoute);

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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