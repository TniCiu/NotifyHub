const { v4: uuidv4 } = require("uuid");

const CampaignRepository = require("../repositories/campaign.repository");
const TemplateRepository = require("../repositories/template.repository");
const NotificationRepository = require("../repositories/notification.repository");
const { extractVariables, renderTemplate } = require("../utils/template.util");
const { publishNotification } = require("../utils/queue.util");
const AppError = require("../common/AppError");
const {
    HTTP_STATUS,
    MESSAGES,
    ERROR_CODE,
    NOTIFICATION_STATUS,
} = require("../constants");

async function createCampaign(payload, user) {
    const template = await TemplateRepository.findByCode(payload.templateCode);

    if (!template || template.status !== "ACTIVE") {
        throw new AppError(
            MESSAGES.NOTIFICATION.TEMPLATE_NOT_FOUND,
            HTTP_STATUS.NOT_FOUND,
            ERROR_CODE.NOTIFICATION.TEMPLATE_NOT_FOUND
        );
    }

    const campaignCode = payload.campaignCode || `CMP_${uuidv4()}`;
    const existingCampaign = await CampaignRepository.findByCode(campaignCode);

    if (existingCampaign) {
        throw new AppError(
            MESSAGES.CAMPAIGN.EXISTS,
            HTTP_STATUS.CONFLICT,
            ERROR_CODE.CAMPAIGN.ALREADY_EXISTS
        );
    }

    const channel = payload.channel || template.channel;

    const campaign = await CampaignRepository.createCampaign({
        campaignCode,
        campaignName: payload.campaignName,
        templateCode: payload.templateCode,
        channel,
        status: "PENDING",
        totalCount: payload.receivers.length,
        createdBy: user?.id || null,
    });

    const contentVariables = Array.isArray(template.variables) && template.variables.length
        ? template.variables
        : extractVariables(template.content);
    const subjectVariables = extractVariables(template.subject || "");
    const variables = Array.from(new Set([...contentVariables, ...subjectVariables]));
    const requests = [];

    for (const item of payload.receivers) {
        const missingVariables = variables.filter((variable) => !(variable in item.data));

        if (missingVariables.length > 0) {
            throw new AppError(
                MESSAGES.TEMPLATE.MISSING_VARIABLES,
                HTTP_STATUS.BAD_REQUEST,
                ERROR_CODE.TEMPLATE.MISSING_VARIABLES,
                {
                    receiver: item.receiver,
                    missingVariables,
                }
            );
        }

        const requestId = `REQ_${uuidv4()}`;
        const subject = renderTemplate(template.subject || "", item.data);
        const renderedContent = renderTemplate(template.content, item.data);

        const notification = await NotificationRepository.createRequest({
            requestId,
            templateCode: payload.templateCode,
            channel,
            receiver: item.receiver,
            subject,
            payload: item.data,
            renderedContent,
            status: NOTIFICATION_STATUS.PENDING,
            campaignId: campaign.id,
        });

        await NotificationRepository.createLog({
            requestId,
            action: "CREATE",
            status: NOTIFICATION_STATUS.PENDING,
            message: MESSAGES.NOTIFICATION.CREATE_SUCCESS,
            rawRequest: {
                campaignId: campaign.id,
                campaignCode: campaign.campaign_code,
                receiver: item.receiver,
                payload: item.data,
            },
            rawResponse: notification,
        });

        await publishNotification({
            requestId,
            channel: notification.channel,
            receiver: notification.receiver,
            subject: notification.subject,
            content: notification.rendered_content,
            payload: notification.payload,
            campaignId: campaign.id,
        });

        await NotificationRepository.updateStatus(requestId, {
            status: NOTIFICATION_STATUS.QUEUED,
            errorMessage: null,
        });

        await NotificationRepository.createLog({
            requestId,
            action: "PUBLISH",
            status: NOTIFICATION_STATUS.QUEUED,
            message: MESSAGES.NOTIFICATION.PUBLISH_SUCCESS,
            rawRequest: notification,
        });

        requests.push({
            requestId,
            receiver: item.receiver,
        });
    }

    return {
        ...campaign,
        requests,
    };
}

async function getCampaigns(query) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);

    return CampaignRepository.findAll({
        page,
        limit,
        status: query.status,
    });
}

async function getCampaignById(id) {
    const campaign = await CampaignRepository.findById(id);

    if (!campaign) {
        throw new AppError(
            MESSAGES.CAMPAIGN.NOT_FOUND,
            HTTP_STATUS.NOT_FOUND,
            ERROR_CODE.CAMPAIGN.NOT_FOUND
        );
    }

    return campaign;
}

async function getCampaignStatistics(id) {
    await getCampaignById(id);

    const stats = await CampaignRepository.getStatistics(id);

    const total = Number(stats.total || 0);
    const success = Number(stats.success || 0);

    return {
        total,
        success,
        failed: Number(stats.failed || 0),
        pending: Number(stats.pending || 0),
        successRate: total === 0 ? 0 : Number(((success / total) * 100).toFixed(2)),
    };
}

module.exports = {
    createCampaign,
    getCampaigns,
    getCampaignById,
    getCampaignStatistics,
};
