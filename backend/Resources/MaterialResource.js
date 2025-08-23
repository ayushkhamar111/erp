class MaterialResource {
    constructor(material) {
        this.material = material;
    }

    toJSON() {
        return {
            id: this.material._id,
            name: this.material.name,
            description: this.material.description
        };
    }

    static collection(materials) {
        return materials.map(material => new MaterialResource(material).toJSON());
    }
}

module.exports = MaterialResource;
