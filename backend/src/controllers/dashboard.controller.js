const DashboardService = require("../services/dashboard.service");
const ApiResponse = require("../common/ApiReponse");
const asyncHandler = require("../common/asyncHandler");
const { HTTP_STATUS, MESSAGES } = require("../constants")


const getSummary = asyncHandler(async (req, res) => {
    const result = await DashboardService.getSummary();
    new ApiResponse(HTTP_STATUS.OK, MESSAGES.DASHBOARD.DASHBOARD_SUMMARY_SUCCESS, result).send(res)

});

const getTrend = asyncHandler(async (req, res) => {
    const result = await DashboardService.getTrend();
    new ApiResponse(HTTP_STATUS.OK, MESSAGES.DASHBOARD.DASHBOARD_TREND_SUCCESS, result).send(res)

});

const getChannelDistribution = asyncHandler(async (req, res) => {
    const result = await DashboardService.getChannelDistribution();
    new ApiResponse(HTTP_STATUS.OK, MESSAGES.DASHBOARD.DASHBOARD_DISTRIBUTION_SUCCESS, result).send(res)

});

const getTopTemplates = asyncHandler(async (req, res) => {
    const result = await DashboardService.getTopTemplates();
    new ApiResponse(HTTP_STATUS.OK, MESSAGES.DASHBOARD.DASHBOARD_TEMPLATES_SUCCESS, result).send(res)
});

module.exports = {
    getSummary,
    getTrend,
    getChannelDistribution,
    getTopTemplates,
};
