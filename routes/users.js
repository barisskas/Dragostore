var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/tolga", (request, response) => {
  response.render("baris", { message: "Selam ben baris" });
});

module.exports = router;
