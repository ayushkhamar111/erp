const messages = require('../lang/messages.json');
const Unit = require('../models/unit');

async function validateMaterialInput(data, excludeId = null) {
    const errors = [];

    if (data.type === undefined || data.type === null || data.type === '') {
        errors.push({ field: 'type', message: messages.type_required || "Type is required." });
    } else if (![1, 2].includes(parseInt(data.type))) {
        errors.push({ field: 'type', message: messages.type_invalid || "Invalid type. Only 1 (Goods) or 2 (Service) allowed." });
    }

    if (data.gst_rate === undefined || data.gst_rate === null || data.gst_rate === '') {
        errors.push({ field: 'gst_rate', message: messages.gst_rate_required || "gst_rate is required." });
    } else if (![1, 2,3].includes(parseInt(data.gst_rate))) {
        errors.push({ field: 'gst_rate', message: messages.type_invalid || "Invalid gst_rate. Only 1 (Goods) or 2 (Service) allowed." });
    }

    if (data.tax_status === undefined || data.tax_status === null || data.tax_status === '') {
        errors.push({ field: 'tax_status', message: messages.tax_status_required || "tax_status is required." });
    } else if (![1, 2,3,4,5,6,7].includes(parseInt(data.tax_status))) {
        errors.push({ field: 'tax_status', message: messages.type_invalid || "Invalid tax_status. Only 1 (Goods) or 2 (Service) allowed." });
    }

    if (!data.name || data.name.trim() === '') {
        errors.push({ field: 'name', message: messages.description_required });
    }
    if (!data.code) {
        errors.push({ field: 'code', message: messages.description_required });
    }
    if (!data.unit_id || data.unit_id.toString().trim() === '') {
        errors.push({ field: 'unit_id', message: messages.unit_required || messages.description_required });
    } else {
        const unitExists = await Unit.findById(data.unit_id);
        if (!unitExists) {
            errors.push({ field: 'unit_id', message: messages.unit_not_found || "Unit does not exist." });
        }
    }

    if (parseInt(data.type) === 1 && (!data.selling_price || data.selling_price === '')) {
        errors.push({ field: 'selling_price', message: messages.selling_price_required || "Selling price is required for goods." });
    }
    if (parseInt(data.type) === 2 && (!data.service_rate || data.service_rate === '')) {
        errors.push({ field: 'service_rate', message: messages.service_rate_required || "Service rate is required for services." });
    }

    const numericFields = [
        "purchase_price",
        "selling_price",
        "mrp",
        "opening_stock",
        "opening_stock_value",
        "minimum_stock_level",
        "service_rate",
        "gst_rate",
        "tax_status"
    ];

    numericFields.forEach(field => {
        if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
            if (isNaN(Number(data[field]))) {
                errors.push({ field, message: messages.number_only || `${field} must be a valid number.` });
            }
        }
    });


    return errors;
}

module.exports = { validateMaterialInput };
