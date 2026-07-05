const TemplateService = require("../services/template.service")
const ApiResponse = require("../common/ApiReponse")
const { HTTP_STATUS, MESSAGES } = require("../constants")
const asyncHandler = require("../common/asyncHandler")

const createTemplate = asyncHandler(async (req, res) => {
    const template = await TemplateService.createTemplate(req.body)
    new ApiResponse(HTTP_STATUS.CREATED, MESSAGES.TEMPLATE.CREATE_SUCCESS, template).send(res)
})

const getTemplates = asyncHandler(async (req, res) => {
    const templates = await TemplateService.getTemplates(req.query)
    new ApiResponse(HTTP_STATUS.OK, MESSAGES.TEMPLATE.GET_ALL_SUCCESS, templates).send(res)
})

const getTemplateById = asyncHandler(async (req, res) => {
    const template = await TemplateService.getTemplateById(req.params.id)
    new ApiResponse(HTTP_STATUS.OK, MESSAGES.TEMPLATE.GET_DETAIL_SUCCESS, template).send(res)
})

const updateTemplate = asyncHandler(async (req, res) => {
    const template = await TemplateService.updateTemplate(req.params.id, req.body)
    new ApiResponse(HTTP_STATUS.OK, MESSAGES.TEMPLATE.UPDATE_SUCCESS, template).send(res)
})

const deleteTemplate = asyncHandler(async (req, res) => {
    await TemplateService.deleteTemplate(req.params.id)
    new ApiResponse(HTTP_STATUS.OK, MESSAGES.TEMPLATE.DELETE_SUCCESS).send(res)
})      

const previewTemplate = asyncHandler(async (req, res) => {
    const preview = await TemplateService.previewTemplate(req.body)
    new ApiResponse(HTTP_STATUS.OK, MESSAGES.TEMPLATE.PREVIEW_SUCCESS, preview).send(res)
})

module.exports = {
    createTemplate,
    getTemplates,
    getTemplateById,
    updateTemplate,
    deleteTemplate,
    previewTemplate,
}