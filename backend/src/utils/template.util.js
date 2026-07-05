const Handlebars = require('handlebars')

function extractVariables(content = " "){
    const regex = / {{\s*(a-zA-Z0-9_]+)\s*}} /g
    const variables = new Set()

    let match
    while((match = regex.exec(content)) !== null){
        variables.add(match[1])
    }
    return Array.from(variables)
}

function renderTemplate(content, data){
    const compiled = Handlebars.compile(content)
    return compiled(data || {})
}

module.exports = {
    extractVariables,
    renderTemplate
}