import request from "../../shared/lib/request";

function getViewPOLogDetails(userProfile) {
	return request({
		url: `/viewPO/getPOLogData`,
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userProfile.token}`
		}
	});
}

function downloadPO(userProfile,fileLoc,fileName) {
	return request({
		url: `/downloadFile`,
		method: "POST",
        responseType: 'blob',
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userProfile.token}`
		},
        data: JSON.stringify({
			file_path: fileLoc,
            file_name: fileName
		}),
        

	    }
    );

}

    function deletePOLogLine(userProfile,fileCode) {
        return request({
            url: `/viewPO/deletePOLine`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userProfile.token}`
            },
            data: JSON.stringify({
                file_code: fileCode
            })
        });
    };

const ViewPOLogService = {
	getViewPOLogDetails,
    downloadPO,
    deletePOLogLine
};

export default ViewPOLogService;