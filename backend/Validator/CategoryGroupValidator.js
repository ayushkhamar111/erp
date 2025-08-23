const messages = require('../lang/messages.json');
const CategoryGroup = require('../models/CategoryGroup');

async function validateCategoryGroupInput(data, excludeId = null) {
    const errors = [];

    if (!data.name || data.name.trim() === '') {
        errors.push({ field: 'name', message: messages.name_required });
    } else {
        const query = { name: data.name.trim() };
        if (excludeId) {
            query._id = { $ne: excludeId };
        }

        const existingCategoryGroup = await CategoryGroup.findOne(query);
        if (existingCategoryGroup) {
            errors.push({ field: 'name', message: messages.name_unique });
        }
    }

    return errors;
}

module.exports = { validateCategoryGroupInput };
