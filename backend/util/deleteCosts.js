const singleCostModel = require('../models/singleCostModel');
const fuelCostModel = require('../models/fuelCostModel');
const repeatingCostModel = require('../models/repeatingCostModel');

/**
 * Deletes all costs for this vin
 * @param vin
 * @returns {Promise<void>}
 */
exports.deleteAllCosts = async (vin) => {
	await new Promise((resolve, reject) => {
		singleCostModel.getAllCostItems({vin: vin}, async (err, costItems) => {
			if (err) {
				reject('DB Error');
			} else {

				for (const costItem of costItems) {
					await new Promise((resolve1) => {
						singleCostModel.deleteCostItem(costItem.id, (err) => {
							if (err) {
								reject('DB Error');
							} else  {
								resolve1();
							}
						});
					});
				}
				resolve();
			}
		});
	});

	await new Promise((resolve, reject) => {
		fuelCostModel.getAllCostItems({vin: vin}, async (err, costItems) => {
			if (err) {
				reject('DB Error');
			} else {

				for (const costItem of costItems) {
					await new Promise((resolve1) => {
						fuelCostModel.deleteCostItem(costItem.id, (err) => {
							if (err) {
								reject('DB Error');
							} else  {
								resolve1();
							}
						});
					});
				}
				resolve();
			}
		});
	});

	await new Promise((resolve, reject) => {
		repeatingCostModel.getAllCostItems({vin: vin}, async (err, costItems) => {
			if (err) {
				reject('DB Error');
			} else {

				for (const costItem of costItems) {
					await new Promise((resolve1) => {
						repeatingCostModel.deleteCostItem(costItem.id, (err) => {
							if (err) {
								reject('DB Error');
							} else  {
								resolve1();
							}
						});
					});
				}
				resolve();
			}
		});
	});

};

