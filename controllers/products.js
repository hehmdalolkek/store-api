const { query } = require('express');
const Products = require('../models/products');


const getAllProducts = async (req, res) => {
	const { featured, company, name, sort, fields, numericFilters } = req.query;
	const queryObject = {};

	if (featured) {
		queryObject.featured = featured;
	}
	if (company) {
		queryObject.company = company;
	}
	if (name) {
		queryObject.name = { $regex: name, $options: 'i' };
	}
	// numericFilters
	if (numericFilters) {
		const operatorMap = {
			'>': '$gt',
			'<': '$lt',
			'>=': '$gte',
			'<=': '$lte',
			'=': '$eq'
		};
		const regExp = /\b(<|>|<=|>=|=)\b/g;
		
		let filters = numericFilters.replace(regExp, match => `-${operatorMap[match]}-`);
		const options = ['price', 'rating'];

		filters = filters.split(',').forEach(element => {
			const [field, operator, value] = element.split('-');
			if (options.includes(field)) {
				queryObject[field] = { [operator]: Number(value) };
			}
		});
	}

	// result
	let result = Products.find(queryObject);

	// sort
	if (sort) {
		const sortList = sort.split(',').join(' ');
		result = result.sort(sortList);
	} else {
		result = result.sort('createAt');
	}

	// select
	if (fields) {
		const filedsList = fields.split(',').join(' ');
		result = result.select(filedsList);
	}

	// pagination
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;
	const skip = limit * (page - 1);
	result = result.skip(skip).limit(limit);


	const products = await result;
	res.status(200).json({ amount: products.length, products });
};


const getAllProductsStatic = async (req, res) => {
	const products = await Products.find({ price: { $gt: 30 } }).sort('price');
	res.status(200).json({ amount: products.length, products });
};



module.exports = {
	getAllProducts,
	getAllProductsStatic,
};