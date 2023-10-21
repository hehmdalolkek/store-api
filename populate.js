require('dotenv').config();

const connectDB = require('./db/connect');
const Products = require('./models/products');

const porductsJSON = require('./products.json');



const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		await Products.deleteMany();
		await Products.create(porductsJSON);

		console.log('db is done');
		process.exit(0);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
}

start();