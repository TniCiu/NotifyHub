const router = require("express").Router()
const TemplateController = require("../controllers/template.controller")
const authMiddleware = require("../middlewares/auth.middleware")

router.post("/", authMiddleware, TemplateController.createTemplate)
router.get("/", authMiddleware, TemplateController.getTemplates)
router.get("/:id", authMiddleware, TemplateController.getTemplateById)
router.put("/:id", authMiddleware, TemplateController.updateTemplate)
router.delete("/:id", authMiddleware, TemplateController.deleteTemplate)
router.post("/preview", authMiddleware, TemplateController.previewTemplate)

module.exports = router