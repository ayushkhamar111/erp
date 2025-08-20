const words = require("../lang/words.json");
const messages = require("../lang/messages.json");
const Unit = require("../Models/Unit");
const UnitResource = require("../Resources/UnitResource");
const {validateUnitInput} = require("../Validator/UnitValidator");


async function list(req, res) {
    const search = req.query.search || null;
    const orderBy = req.query.order_by || 'id';
    const orderDir = req.query.order_dir == 1 ? 'asc' : 'desc';
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const filter = {};
    if (search) {
        filter.name = { $regex: search, $options: 'i' };
        filter.description = { $regex: search, $options: 'i' };
    }

    const sort = {};
    sort[orderBy] = orderDir.toLowerCase() === 'asc' ? 1 : -1;

    const total = await Unit.countDocuments(filter);

    // Get paginated data
    const units = await Unit.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);

    const data = UnitResource.collection(units);

    return res.json({
        status: true,
        data,
        total,
        page,
        last_page: Math.ceil(total / limit),
        order_by: orderBy,
        order_dir: orderDir
    });

}

async function store(req, res) {
    try {

        const errors = await validateUnitInput(req.body, req.body.id);
        if (errors.length > 0) {
            return res.status(422).json({ status: false, errors });
        }

        let model = await Unit.findById(req.body.id);
        let message;

        if (model) {
            Object.assign(model, req.body);
            model = await model.save();
            message = words.unit + messages.updated_successfully;
        } else {
            model = new Unit(req.body);
            await model.save();
            message = words.unit + messages.created_successfully;
        }
        const data = new UnitResource(model).toJSON();

        return res.json({
            status: true,
            message: message,
            data: data
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: messages.internal_server_error
        });
    }
}


async function deleteUnit(req, res) {
    try {
        const unit = await Unit.findById(req.params.id);

        if (!unit) {
            return res.status(404).json({
                status: false,
                message: words.unit + messages.not_found
            });
        }

        await Unit.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: true,
            message: words.unit + messages.deleted_successfully
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: messages.error_deleting + words.unit,
            error
        });
    }
};

module.exports = {
    list,store, deleteUnit
};
