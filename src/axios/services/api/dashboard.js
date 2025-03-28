import request from "../../shared/lib/request";

function getDashboardDetails(userProfile) {
	const dbSchema = localStorage.getItem('serverSchema');
	return request({
		url: `/dashboard/getDashboardDetails`,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userProfile.token}`,
		},
		data: JSON.stringify({
			usertype: userProfile.usertype,
			schema: dbSchema
		}),
	});
}

function getDashboardErrorTiles({userProfile,selectedDate}) {
	const dbSchema = localStorage.getItem('serverSchema');
	return request({
		url: `/dashboard/getDashTilesError`,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userProfile.token}`,
		},
		data: JSON.stringify({
			schema: dbSchema,
			dashDate : selectedDate
		}),
	});
}

function getDashboardChartData(userProfile) {
	const dbSchema = localStorage.getItem('serverSchema');
	return request({
		url: `/dashboard/getDashTilesChart`,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userProfile.token}`,
		},
		data: JSON.stringify({
			schema: dbSchema
		}),
	});
}

const DashboardService = {
	getDashboardDetails,
	getDashboardErrorTiles,
	getDashboardChartData
};

export default DashboardService;
