const CampaignService = require("../services/campaign.service");
const ApiResponse = require("../common/ApiReponse");
const asyncHandler = require("../common/asyncHandler");
const { HTTP_STATUS, MESSAGES } = require("../constants");

const createCampaign = asyncHandler(async (req, res) => {
    const campaign = await CampaignService.createCampaign(req.body, req.user);

    new ApiResponse(HTTP_STATUS.CREATED, MESSAGES.CAMPAIGN.CREATE_SUCCESS, campaign).send(res);
});

const getCampaigns = asyncHandler(async (req, res) => {
    const result = await CampaignService.getCampaigns(req.query);

    new ApiResponse(HTTP_STATUS.OK, MESSAGES.CAMPAIGN.GET_ALL_SUCCESS, result).send(res);
});

const getCampaignById = asyncHandler(async (req, res) => {
    const campaign = await CampaignService.getCampaignById(req.params.id);

    new ApiResponse(HTTP_STATUS.OK, MESSAGES.CAMPAIGN.GET_DETAIL_SUCCESS, campaign).send(res);
});

const getCampaignStatistics = asyncHandler(async (req, res) => {
    const result = await CampaignService.getCampaignStatistics(req.params.id);

    new ApiResponse(HTTP_STATUS.OK, MESSAGES.CAMPAIGN.GET_STATISTICS_SUCCESS, result).send(res);
});

module.exports = {
    createCampaign,
    getCampaigns,
    getCampaignById,
    getCampaignStatistics,
};
