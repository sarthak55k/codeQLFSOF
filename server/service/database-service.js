const mongoose = require("mongoose");

let instance;

class DataService {
    constructor(connectionString) {
        if (instance) {
            throw new Error("You can only create one instance!");
        }
        this.connectionString = connectionString;
        instance = this;
    }

    connect() {
        mongoose.connect(this.connectionString);
    }
}

module.exports = DataService;