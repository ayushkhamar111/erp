const Material = require('../Models/Material');
const messages = require("../lang/messages.json");
const words = require("../lang/words.json");
const MaterialResource = require("../Resources/MaterialResource");
const {validateMaterialInput} = require("../Validator/validateMaterialInput");


async function list(req, res) {
    materials = await Material.find();
    res.status(200).json({ status: true, message: 'Material data Fetched', materials });
}

async function store(req, res) {

    try {

        const errors = await validateMaterialInput(req.body, req.body.id);
        if (errors.length > 0) {
            return res.status(422).json({ status: false, errors });
        }

        let model = await Material.findById(req.body.id);
        let message;

        if (model) {
            Object.assign(model, req.body);
            model = await model.save();
            message = words.material + messages.updated_successfully;
        } else {
            model = new Material(req.body);
            await model.save();
            message = words.material + messages.created_successfully;
        }
        const data = new MaterialResource(model).toJSON();

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

    const material = new Material(req.body);
    await material.save();
    res.status(200).json({ status: true, message: 'Material Created successfully', material });

}
async function updateMaterial(req, res)  {
    try {
       
         const material = await Material.findById(req.params.id);
        if (!material) {
            return res.status(404).json({ status: false, message: 'Material not found' });
        }
        
        Object.assign(material, req.body);
        const updatedMaterial = await material.save();

        res.status(200).json({
            status: true,
            message: 'Material Updated successfully',
            data: updatedMaterial
        });
    } catch (error) {
        res.status(500).json({status: false, message: 'Error updating material', error });
    }
};

async function deleteMaterial(req, res)  {
    try {
        const material = await Material.findById(req.params.id);

        if (!material) {
            return res.status(404).json({ status: false, message: 'Material not found' });
        }
        
        await Material.findByIdAndDelete(req.params.id);
       
        res.status(200).json({
            status: true,
            message: 'Material Deleted successfully',
        });
    } catch (error) {
        res.status(500).json({status: false, message: 'Error updating material', error });
    }
};


module.exports = {
    list, store,updateMaterial,deleteMaterial
};
