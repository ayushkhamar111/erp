const Vendor = require('../Models/Vendor');
const { validateVendorInput } = require('../Validator/vendorValidator');
const messages = require('../lang/messages.json');
const words = require('../lang/words.json');


async function list(req, res) {
    vendors = await Vendor.find();
    res.status(200).json({ status: true, message: words.vendor + messages,data_fetched, vendors });
}

async function create(req, res) {

    const errors = validateVendorInput(req.body);
    if (errors.length > 0) {
        return res.status(422).json({ status: false, errors });
    }

    const vendor = new Vendor(req.body);
    await vendor.save();
    res.status(200).json({ status: true, message: words.vendor + messages,created_successfully, vendor });

}
async function updateVendor(req, res) {
    try {

        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) {
            return res.status(404).json({ status: false, message: words.vendor + messages,not_found });
        }

        Object.assign(vendor, req.body);
        const updateVendor = await vendor.save();

        res.status(200).json({
            status: true,
            message: words.vendor + messages,updated_successfully,
            data: updateVendor
        });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error updating vendor', error });
    }
};

async function deleteVendor(req, res) {
    try {
        const vendor = await Vendor.findById(req.params.id);

        if (!vendor) {
            return res.status(404).json({ status: false, message: words.vendor + messages,not_found });
        }

        await Vendor.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: true,
            message: words.vendor + messages,deleted_successfully,
        });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error updating vendor', error });
    }
};


module.exports = {
    list, create, updateVendor, deleteVendor
};
