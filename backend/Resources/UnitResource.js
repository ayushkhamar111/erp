class UnitResource {
    constructor(unit) {
        this.unit = unit;
    }

    toJSON() {
        return {
            id: this.unit._id,
            name: this.unit.name,
            description: this.unit.description
        };
    }

    static collection(units) {
        return units.map(unit => new UnitResource(unit).toJSON());
    }
}

module.exports = UnitResource;
