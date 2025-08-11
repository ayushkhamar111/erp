const words = require("../lang/words.json");
const messages = require("../lang/messages.json");
const ChartOfAccount = require("../Models/ChartOfAccount");


async function list(req, res) {
    chart_of_accounts = await ChartOfAccount.find();
    res.status(200).json({ status: true, message: words.chart_of_accounts + messages.data_fetched, chart_of_accounts });
}


async function store(req, res) {
    try {
        let model = await ChartOfAccount.findById(req.body.id);
        let message;

        if (model) {
            Object.assign(model, req.body);
            model = await model.save();
            message = words.chart_of_accounts + messages.updated_successfully;
        } else {
            model = new ChartOfAccount(req.body);
            await model.save();
            message = words.chart_of_accounts + messages.created_successfully;
        }

        return res.json({
            status: true,
            message: message,
            data: model
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: messages.internal_server_error
        });
    }
}


async function deleteChartOfAccount(req, res) {
    try {
        const chart_of_accounts = await ChartOfAccount.findById(req.params.id);

        if (!chart_of_accounts) {
            return res.status(404).json({
                status: false,
                message: words.chart_of_accounts + messages.not_found
            });
        }

        await ChartOfAccount.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: true,
            message: words.chart_of_accounts + messages.deleted_successfully
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: messages.error_deleting + words.chart_of_accounts,
            error
        });
    }
};

module.exports = {
    list,store, deleteChartOfAccount
};
