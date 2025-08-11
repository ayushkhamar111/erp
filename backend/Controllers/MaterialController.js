const Material = require('../Models/Material');


async function list(req, res) {
    materials = await Material.find();
    res.status(200).json({ status: true, message: 'Material data Fetched', materials });
}

async function create(req, res) {

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
    list, create,updateMaterial,deleteMaterial
};
