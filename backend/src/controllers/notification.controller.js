const NotificationService = require("../services/notification.service")
const ApiResponse = require("../common/ApiReponse")
const { HTTP_STATUS, MESSAGES } = require("../constants")
const asyncHandler = require("../common/asyncHandler")

const createNotification = asyncHandler(async (req, res) => {
    const notification = await NotificationService.createNotification(req.body)
    new ApiResponse(HTTP_STATUS.ACCEPTED, MESSAGES.NOTIFICATION.CREATE_SUCCESS, notification).send(res)
})

const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await NotificationService.getNotifications(req.query)
    new ApiResponse(HTTP_STATUS.OK, MESSAGES.NOTIFICATION.GET_ALL_SUCCESS, notifications).send(res)
})

const getNotificationByRequestId = asyncHandler(async (req, res) => {
    const notification = await NotificationService.getNotificationByRequestId(req.params.requestId)
    new ApiResponse(HTTP_STATUS.OK, MESSAGES.NOTIFICATION.GET_DETAIL_SUCCESS, notification).send(res)
})

module.exports = {
    createNotification,
    getNotifications,
    getNotificationByRequestId,
}
