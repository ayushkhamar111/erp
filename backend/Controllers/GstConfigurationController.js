
const words = require("../lang/words.json");
const messages = require("../lang/messages.json");


async function taxStatus(req, res) {
    const data = [
        { id: 1, name: 'Taxable' },
        { id: 2, name: 'Exempt' },
        { id: 3, name: 'Non-GST' }
    ];

    res.status(200).json({
        status: true,
        message: words.tax_status + messages.data_fetched,
        data
    });
}

async function gstRate(req, res) {
    const data = [
        { id: 1, name: '0% GST' },
        { id: 2, name: '1.25% GST' },
        { id: 3, name: '3% GST' },
        { id: 4, name: '5% GST' },
        { id: 5, name: '12% GST' },
        { id: 6, name: '18% GST' },
        { id: 7, name: '28% GST' }
    ];

    res.status(200).json({
        status: true,
        message: words.gst_rate + messages.data_fetched,
        data
    });
}

module.exports = {
    taxStatus,gstRate
};
