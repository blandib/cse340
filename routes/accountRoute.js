const express = require("express"); 
const router = express.Router(); 
const utilities = require("../utilities/index"); 
const accountController = require("../controllers/accountController"); 
const regValidate = require('../utilities/account-validation');

//// GET route for "login"
router.get("/login", accountController.buildLogin);
// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Register route
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.post("/register", regValidate.registrationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount));


/******************************
 * Add Error Handling Middleware
 * ************************************ */
//router.use(utilities.errorHandler);
router.post(
  "/register",
  regValidate.registrationRules(),  
  regValidate.checkRegData,         
  utilities.handleErrors(accountController.registerAccount)
)

router.post("/login", (req, res) => {
  res.status(200).send("login process");
});


module.exports = router;