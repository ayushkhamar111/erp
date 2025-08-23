class CategoryGroupResource {
    constructor(category_group) {
        this.category_group = category_group;
    }

    toJSON() {
        return {
            id: this.category_group._id,
            name: this.category_group.name,
        };
    }

    static collection(category_groups) {
        return category_groups.map(unit => new CategoryGroupResource(category_group).toJSON());
    }
}

module.exports = CategoryGroupResource;
