const mongoose = require("mongoose");

const dbConnection = async () => {
	mongoose.set("strictQuery", false);
	mongoose.set("returnOriginal", false);

	await mongoose.connect(process.env.MONGODB_CNN).then(
		() => console.log("Data base connected"),
		() => console.log("Error in database connection")
	);
};

module.exports = {
	dbConnection,
};
