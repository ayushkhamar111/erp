const words = require("../lang/words.json");
const messages = require("../lang/messages.json");
const AccountType = require("../Models/AccountType");


async function list(req, res) {
    data = await AccountType.find();
    res.status(200).json({ status: true, data });
}


async function store(req, res) {
    try {
        let model = await AccountType.findById(req.body.id);
        let message;

        if (model) {
            Object.assign(model, req.body);
            model = await model.save();
            message = words.account_type + messages.updated_successfully;
        } else {
            model = new AccountType(req.body);
            await model.save();
            message = words.account_type + messages.created_successfully;
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


async function deleteAccountType(req, res) {
    try {
        const account_type = await AccountType.findById(req.params.id);

        if (!account_type) {
            return res.status(404).json({
                status: false,
                message: words.account_type + messages.not_found
            });
        }

        await AccountType.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: true,
            message: words.account_type + messages.deleted_successfully
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: messages.error_deleting + words.account_type,
            error
        });
    }
};

module.exports = {
    list,store, deleteAccountType
};
