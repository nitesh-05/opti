import request from "../../shared/lib/request";

function viewUserDetails(userProfile) {
	return request({
		url: `/users/getUserViewGridData`,
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userProfile.token}`
		}
	});
};

function saveUserDetails(formData,userProfile){
	return request({
		url: `/users/saveUserData`,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userProfile.token}`
		},
		data: JSON.stringify({
			employee_code: formData.empCode,
			employee_name: formData.empName, 
			employee_mail_id: formData.empMailId ,
			employee_status: formData.empStatus,
			employee_user_type: formData.userType,
			employee_phone_no: formData.phoneNo,
			mod_flag:formData.appModFlag
		})
	});

};

function modUserDetails(formData,userProfile,empCode){
	return request({
		url: `/users/modUserData`,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userProfile.token}`
		},
		data:JSON.stringify({formData,
		employee_code: empCode})
	});

};



const UserMasterService = {
	viewUserDetails,
	saveUserDetails,
	modUserDetails
};

export default UserMasterService;
