const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { create, list } = require("../controllers/resourceController");

router.post("/", auth, create);
router.get("/:project_id", auth, list);

module.exports = router;