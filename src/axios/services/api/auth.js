import request from "../../shared/lib/request";

function addUser(data) {
	return request({
		url: `/authenticate`,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		data: JSON.stringify({
			username: data.username,
			password: data.password,
			schema:data.selectedServer
		}),
	});
}

function getLoginDetails() {
	return request({
		url: `/login/pageDetails`,
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		}
	});
}


function forgotPassword(userId) {
	return request({
		url: `/login/retrievePassword`,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		data: JSON.stringify({
				"userId": userId
		}),
	});
}

function getUserType(token) {
	return request({
		url: `/dashboard/getUserType`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
}

const AuthService = {
	addUser,
	getUserType,
	forgotPassword,
	getLoginDetails
};

export default AuthService;
