const messages = require('../lang/messages.json');
const Unit = require('../models/unit');

async function validateUnitInput(data, excludeId = null) {
    const errors = [];

    if (!data.description || data.description.trim() === '') {
        errors.push({ field: 'description', message: messages.description_required });
    }
    if (!data.name || data.name.trim() === '') {
        errors.push({ field: 'name', message: messages.name_required });
    } else {
        const query = { name: data.name.trim() };
        if (excludeId) {
            query.id = { $ne: excludeId };
        }

        const existingUnit = await Unit.findOne(query);
        if (existingUnit) {
            errors.push({ field: 'name', message: messages.name_unique });
        }
    }

    return errors;
}

module.exports = { validateUnitInput };
