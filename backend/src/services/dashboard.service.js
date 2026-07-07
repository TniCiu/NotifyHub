const DashboardRepository = require("../repositories/dashboard.repository");

async function getSummary() {
    const summary = await DashboardRepository.getSummary();

    const total = Number(summary.total || 0);
    const success = Number(summary.success || 0);

    const successRate = total === 0 ? 0 : Number(((success / total) * 100).toFixed(2));

    return {
        total,
        success,
        failed: Number(summary.failed || 0),
        pending: Number(summary.pending || 0),
        successRate,
    };
}

async function getTrend() {
    return DashboardRepository.getTrend();
}

async function getChannelDistribution() {
    return DashboardRepository.getChannelDistribution();
}

async function getTopTemplates() {
    return DashboardRepository.getTopTemplates();
}

module.exports = {
    getSummary,
    getTrend,
    getChannelDistribution,
    getTopTemplates,
};