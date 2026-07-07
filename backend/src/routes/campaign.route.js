const router = require("express").Router();

const CampaignController = require("../controllers/campaign.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const {
    validateBody,
    validateParams,
    validateQuery,
} = require("../middlewares/validate.middleware");
const {
    campaignIdSchema,
    createCampaignSchema,
    getCampaignsQuerySchema,
} = require("../validators/campaign.validator");

router.post(
    "/",
    authMiddleware,
    validateBody(createCampaignSchema),
    CampaignController.createCampaign
);

router.get("/", authMiddleware, validateQuery(getCampaignsQuerySchema), CampaignController.getCampaigns);
router.get("/:id/statistics", authMiddleware, validateParams(campaignIdSchema), CampaignController.getCampaignStatistics);
router.get("/:id", authMiddleware, validateParams(campaignIdSchema), CampaignController.getCampaignById);

module.exports = router;
