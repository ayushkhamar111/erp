const words = require("../lang/words.json");
const messages = require("../lang/messages.json");
const CategoryGroup = require("../Models/CategoryGroup");
const CategoryGroupResource = require("../Resources/CategoryGroupResource");
const {validateCategoryGroupInput} = require("../Validator/CategoryGroupValidator");


async function list(req, res) {
    const search = req.query.search || null;
    const orderBy = req.query.order_by || 'id';
    const orderDir = req.query.order_dir == 1 ? 'asc' : 'desc';
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const filter = {};
    if (search) {
        filter.name = { $regex: search, $options: 'i' };
    }

    const sort = {};
    sort[orderBy] = orderDir.toLowerCase() === 'asc' ? 1 : -1;

    const total = await CategoryGroup.countDocuments(filter);

    // Get paginated data
    const units = await CategoryGroup.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);

    const data = CategoryGroupResource.collection(units);

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

        const errors = await validateCategoryGroupInput(req.body, req.body.id);
        if (errors.length > 0) {
            return res.status(422).json({ status: false, errors });
        }

        let model = await CategoryGroup.findById(req.body.id);
        let message;

        if (model) {
            Object.assign(model, req.body);
            model = await model.save();
            message = words.category_group + messages.updated_successfully;
        } else {
            model = new CategoryGroup(req.body);
            await model.save();
            message = words.category_group + messages.created_successfully;
        }
        const data = new CategoryGroupResource(model).toJSON();

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


async function deleteCategoryGroup(req, res) {
    try {
        const category_group = await CategoryGroup.findById(req.params.id);

        if (!category_group) {
            return res.status(404).json({
                status: false,
                message: words.category_group + messages.not_found
            });
        }

        await CategoryGroup.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: true,
            message: words.category_group + messages.deleted_successfully
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: messages.error_deleting + words.category_group,
            error
        });
    }
};

module.exports = {
    list,store, deleteCategoryGroup
};
