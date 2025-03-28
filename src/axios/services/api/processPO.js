import request from "../../shared/lib/request";

function processPOFile(userProfile) {
	const dbSchema = localStorage.getItem('serverSchema');
	return request({
		url: `/file/processFile`,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userProfile.token}`,
		},
		data: JSON.stringify({
			schema: dbSchema
		})
	});
}


const ProcessPOService = {
	processPOFile
};

export default ProcessPOService;
