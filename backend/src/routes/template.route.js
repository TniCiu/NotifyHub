const router = require("express").Router()
const TemplateController = require("../controllers/template.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const {
    validateBody,
    validateParams,
    validateQuery,
} = require("../middlewares/validate.middleware")
const {
    templateIdSchema,
    createTemplateSchema,
    updateTemplateSchema,
    getTemplatesQuerySchema,
    previewTemplateSchema,
} = require("../validators/template.validator")

router.post("/", authMiddleware, validateBody(createTemplateSchema), TemplateController.createTemplate)
router.get("/", authMiddleware, validateQuery(getTemplatesQuerySchema), TemplateController.getTemplates)
router.post("/preview", authMiddleware, validateBody(previewTemplateSchema), TemplateController.previewTemplate)
router.get("/:id", authMiddleware, validateParams(templateIdSchema), TemplateController.getTemplateById)
router.put("/:id", authMiddleware, validateParams(templateIdSchema), validateBody(updateTemplateSchema), TemplateController.updateTemplate)
router.delete("/:id", authMiddleware, validateParams(templateIdSchema), TemplateController.deleteTemplate)

module.exports = router
