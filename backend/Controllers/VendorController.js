const Vendor = require('../Models/Vendor');
const { validateVendorInput } = require('../Validator/vendorValidator');


async function list(req, res) {
    vendors = await Vendor.find();
    res.status(200).json({ status: true, message: 'Vendor data Fetched', vendors });
}

async function create(req, res) {

    const errors = validateVendorInput(req.body);
    if (errors.length > 0) {
        return res.status(422).json({ status: false, errors });
    }

    const vendor = new Vendor(req.body);
    await vendor.save();
    res.status(200).json({ status: true, message: 'Vendor Created successfully', vendor });

}
async function updateVendor(req, res) {
    try {

        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) {
            return res.status(404).json({ status: false, message: 'Vendor not found' });
        }

        Object.assign(vendor, req.body);
        const updateVendor = await vendor.save();

        res.status(200).json({
            status: true,
            message: 'Vendor Updated successfully',
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
            return res.status(404).json({ status: false, message: 'Vendor not found' });
        }

        await Vendor.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: true,
            message: 'Vendor Deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error updating vendor', error });
    }
};


module.exports = {
    list, create, updateVendor, deleteVendor
};
