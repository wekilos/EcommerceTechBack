const axios = require("axios");

const BASE_URL = "http://119.235.118.211:8080";

const getOnlinePayment = async (req, res) => {
	const { order_id, price } = req.body;

	try {
		let config = {
			baseURL: "https://mpi.gov.tm/payment/rest/register.do?",
			url: "/",
			method: "get",
			params: {
				orderNumber: order_id,
				amount: price * 100,
				currency: "934",
				language: "ru",
				returnUrl: `http://ast.com.tm/?type=success&order_id=${order_id}`,
				failUrl: `http://ast.com.tm/?type=cancel&order_id=${order_id}`,
				userName: 701411000036,
				password: "E2hgRvgPdffhU83",
				pageView: "Desktop",
				description: "orderDesc",
			},
		};

		let response = await axios(config);

		if (response.data.errorCode != 0 && response.data.errorCode != 1) {
			throw new Error(`Unexpected errorCode ${response.data.errorCode}`);
		}

		if (response.data.errorCode == 1) {
			const new_order_id = Date.now().toString();
			config.params.orderNumber = new_order_id;
			config.params.returnUrl = `http://ast.com.tm/?type=success&order_id=${new_order_id}`;
			config.params.failUrl = `http://ast.com.tm/?type=cancel&order_id=${new_order_id}`;

			response = await axios(config);
			if (response.data.errorCode != 0) {
				throw new Error(`Unexpected errorCode ${response.data.errorCode}`);
			}
			response.data.order_id = new_order_id;
		}

		res.status(200).json(response.data);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message });
	}
};

const updateOnlinePaymentStatus = async (req, res) => {
	const { order_id, is_paid } = req.body;
	console.log(req.body);
	try {
		const response = await axios.post(BASE_URL + "/grocery_order_payment", {
			order_id,
			is_paid,
		});
		res.status(200).json(response.data);
		console.log(response.data);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: err });
	}
};

exports.getOnlinePayment = getOnlinePayment;
exports.updateOnlinePaymentStatus = updateOnlinePaymentStatus;
