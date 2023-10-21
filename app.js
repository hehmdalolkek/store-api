require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const connectDB = require('./db/connect');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlersMiddleware = require('./middleware/error-handlers');

const router = require('./routes/products');



// middleware
app.use(express.json());



// routes
app.get('/', (req, res) => {
	res.status(200).send('<h1>Store API</h1><a href="/api/v1/products">Products</a>');
})

app.use('/api/v1/products', router);

app.use(notFoundMiddleware);

app.use(errorHandlersMiddleware);



const PORT = process.env.PORT || 3000;

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(PORT, () => {
			console.log(`Server is listening port ${PORT}..`);
		})
	} catch (error) {
		console.log(error);
	}
};

start();