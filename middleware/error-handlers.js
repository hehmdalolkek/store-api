const errorHandlers = async (err, req, res, next) => {
	console.log(err);
	res.status(500).json({ msg: 'Someting went wrong' });
};


module.exports = errorHandlers;