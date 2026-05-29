const mongooe = require('mongoose');

function connectDB() {
    mongooe.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("Server is connected to DB");
        })
        .catch((err) => {
            console.log("Error connecting to DB", err);
            process.exit(1);
        })
}

module.exports = connectDB;