const vehicleModel = require('../models/vehicleModel');
const {validationResult, check, body} = require('express-validator');
const {deleteAllCosts} = require('../util/deleteCosts');

/**
 * Get a list of all vehicles
 * @param req
 * @param callback
 */
exports.getAlLVehicles = (req, callback) => {
	const {username} = req.body;

	vehicleModel.getAllVehicles(username, (err, vehicles) => {
		if (err) {
			callback(err, null);
		} else {
			callback(null, vehicles);
		}
	});
};

/**
 * Add a new vehicle
 * @param req
 * @param callback
 */
exports.addNewVehicle = (req, callback) => {
	const {vehicle} = req.body;

	vehicleModel.addVehicle(vehicle, (err, data) => {
		if (err) {
			callback(err, null);
		} else {
			callback(null, data);
		}
	});
};

/**
 * Gets a specific vehicle
 * @param req
 * @param callback
 */
exports.getVehicle = (req, callback) => {
	const {vin} = req;
	const {username} = req.body;

	vehicleModel.getVehicle(vin, username, (err, data) => {
		if (err) {
			callback(err, null);
		}else if (data.length === 0) {
			callback(null, null);
		} else {
			callback(null, data[0]);
		}
	});
};

/**
 * Updates a vehicle with given vin and full Set
 * @param req
 * @param callback
 */
exports.updateVehicle = (req, callback) => {
	const {vehicle} = req.body;
	const {vin} = req;

	vehicleModel.modifyVehicle(vin, vehicle, (err, numReplaced) => {
		if (err) {
			callback(err, null);
		} else if (numReplaced === 0) {
			callback(null, null);
		} else {
			callback(null, numReplaced);
		}
	});
};

/**
 * Delete a vehicle via vin
 * @param req
 * @param callback
 */
exports.deleteVehicle = (req, callback) => {
	const {vin} = req;

	vehicleModel.deleteVehicle(vin, (err, data) => {
		if (err) {
			callback(err, null);
		} else {
			deleteAllCosts(vin).then(callback(null, data));
		}
	});
};

/**
 * Checks the vehicle Data
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
exports.checkVehicle = async (req, res, next) => {
	await check('vin')
		.if(() => req.method !== 'PUT')
		.exists()
		.bail()
		.isString()
		.bail()
		.trim()
		.escape()
		.toUpperCase()
		.custom(value => existsVin(value))
		.run(req);

	await check('name')
		.exists()
		.bail()
		.isString()
		.bail()
		.trim()
		.run(req);

	await check('year')
		.if(body('year').exists())
		.if(() => req.body.year)
		.isString()
		.run(req);

	await check('make')
		.exists()
		.bail()
		.isString()
		.run(req);

	await check('model')
		.if(body('model').exists())
		.if(() => req.body.model)
		.isString()
		.run(req);

	await check('type')
		.if(body('type').exists())
		.if(() => req.body.type)
		.isString()
		.run(req);

	await check('color')
		.if(body('color').exists())
		.if(() => req.body.color)
		.isString()
		.run(req);

	await check('weight')
		.if(body('weight').exists())
		.if(() => req.body.weight)
		.isNumeric()
		.bail()
		.custom(value => {
			if (value < 0) {
				return Promise.reject('Negative weight');
			} else {
				return Promise.resolve();
			}
		})
		.run(req);

	await check('license')
		.if(body('license').exists())
		.if(() => req.body.license)
		.isString()
		.run(req);

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({errors: errors.array()});
	} else {
		const {
			username,
			vin,
			name,
			year,
			make,
			model,
			type,
			color,
			weight,
			license
		} = req.body;

		const newVin = vin.replace(/\s+/, '_');

		req.body.vehicle = {
			username: username,
			vin: newVin,
			name: name,
			year: year ? year : null,
			make: make ? make : null,
			model: model ? model : null,
			type: type ? type : null,
			color: color ? color : null,
			weight: weight ? weight : null,
			license: license ? license : null
		};

		next();
	}
};

/**
 * Checks the vin in the params
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
exports.checkVinParam = async (req, res, next) => {
	await check('vin')
		.exists()
		.bail()
		.isString()
		.bail()
		.trim()
		.escape()
		.toUpperCase()
		.custom(value => existsVinOnExist(value, req.body.username))
		.run(req);

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({errors: errors.array()});
	} else {
		req.vin = req.params.vin.replace(/\s+/, '_');
		next();
	}
};

/**
 * Checks whether the given vin exists or not, resolves if it doesn't exist
 * @param vin
 * @returns {Promise<unknown>}
 */
const existsVin = async (vin) => {
	return new Promise((resolve, reject) => {
		vehicleModel.findVin(vin, (err, result) => {
			if (err) {
				reject('Internal Server Error');
			} else if (result.length !== 0) {
				reject('VIN already exists');
			} else {
				resolve();
			}

		});
	});
};

/**
 * Checks whether the given vin exists or not, resolves if it does exist
 * @param vin
 * @param username
 * @returns {Promise<unknown>}
 */
const existsVinOnExist = async (vin, username) => {
	return new Promise((resolve, reject) => {
		vehicleModel.findVin(vin, (err, result) => {
			if (err) {
				reject('Internal Server Error');
			} else if (result.length === 0) {
				reject('VIN doesn\'t exists');
			} else {
				if (result[0].username !== username) {
					reject('VIN doesn\'t exists');
				} else {
					resolve();
				}
			}
		});
	});
};


