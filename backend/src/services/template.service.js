const TemplateRepository = require("../repositories/template.repository")
const { extractVariables, renderTemplate } = require("../utils/template.util")
const { HTTP_STATUS, MESSAGES, ERROR_CODE } = require("../constants")
const AppError = require("../common/AppError")

async function createTemplate(payload) {
    const exitingTemplate = await TemplateRepository.findByCode(payload.templateCode)
    if (exitingTemplate) {
        throw new AppError(MESSAGES.TEMPLATE.EXISTS, HTTP_STATUS.CONFLICT, ERROR_CODE.TEMPLATE.ALREADY_EXISTS)
    }

    const variables = extractVariables(payload.content)

    const template = await TemplateRepository.createTemplate({
        ...payload,
        variables,
    })
    return template
}

async function getTemplates(query) {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10

    return TemplateRepository.findAll({
        page,
        limit,
        keyword: query.keyword,
        status: query.status,
        channel: query.channel,
    })
}

async function getTemplateById(id) {
    const template = await TemplateRepository.findById(id)
    if (!template) {
        throw new AppError(MESSAGES.TEMPLATE.NOT_FOUND, HTTP_STATUS.NOT_FOUND, ERROR_CODE.TEMPLATE.NOT_FOUND)
    }
    return template

}

async function updateTemplate(id, payload) {
    const template = await TemplateRepository.findById(id)
    if (!template) {
        throw new AppError(MESSAGES.TEMPLATE.NOT_FOUND, HTTP_STATUS.NOT_FOUND, ERROR_CODE.TEMPLATE.NOT_FOUND)
    }

    const variables = extractVariables(payload.content)

    const updatedTemplate = await TemplateRepository.updateTemplate(id, {
        ...payload,
        variables,
    })
    return updatedTemplate
}

async function deleteTemplate(id) {
    const template = await TemplateRepository.deleteTemplate(id)
    if (!template) {
        throw new AppError(MESSAGES.TEMPLATE.NOT_FOUND, HTTP_STATUS.NOT_FOUND, ERROR_CODE.TEMPLATE.NOT_FOUND)
    }

    return template
}

async function previewTemplate({content, data}) {
    const variables = extractVariables(content)
    const missingVariables = variables.filter((variable) => !(variable in data))

    if (missingVariables.length > 0) {
        throw new AppError(
            MESSAGES.TEMPLATE.MISSING_VARIABLES,
            HTTP_STATUS.BAD_REQUEST,
            ERROR_CODE.TEMPLATE.MISSING_VARIABLES,
            { missingVariables }
        )
    }

    return renderTemplate(content, data)
}

module.exports = {
    createTemplate,
    getTemplates,
    getTemplateById,
    updateTemplate,
    deleteTemplate,
    previewTemplate,
}
