import request from "../../shared/lib/request";

function getViewPODetails(userProfile) {
	return request({
		url: `/viewPO/getPOGridData`,
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userProfile.token}`
		}
	});
}

function getPOLineDetails(userProfile,poIntCode) {
	return request({
		url: `/viewPO/getPOLineData`,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userProfile.token}`
		},
		data: JSON.stringify({
			po_int_code: poIntCode
		})
	});
}

function getStatus(userProfile) {
	const dbSchema = localStorage.getItem('serverSchema');
	
	return request({
		url: `/viewPO/getPOStatus`,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userProfile.token}`
		},
		data: JSON.stringify({
			schema: dbSchema
		})
	});
}


function validatePO(userProfile,poHeaderIntCode) {
    const dbSchema = localStorage.getItem('serverSchema');

	return request({
		url: `/po/validate`,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userProfile.token}`
		},
        data: JSON.stringify({
			schema: dbSchema,
			headerIntCode: poHeaderIntCode
		}),
	});
}


const ViewPOService = {
	getViewPODetails,
	getPOLineDetails,
	validatePO,
	getStatus
};

export default ViewPOService;