const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { create, list } = require("../controllers/projectController");

router.post("/", auth, create);
router.get("/", auth, list);

module.exports = router;