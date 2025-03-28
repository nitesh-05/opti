import request from "../../shared/lib/request";
import axios from "axios";

function getTables(userProfile) {
  const dbSchema = localStorage.getItem("serverSchema");
  return request({
    url: `/crud/getTables`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userProfile.token}`,
    },
    data: JSON.stringify({
      usertype: userProfile.usertype,
      schema: dbSchema,
    }),
  });
}

function getTableData({ userProfile, table }) {
  const dbSchema = localStorage.getItem("serverSchema");
  return request({
    url: `/crud/getTableData`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userProfile.token}`,
    },
    data: JSON.stringify({
      tableName: table,
      schema: dbSchema,
    }),
  });
}

function getPrimaryKey({ userProfile, table }) {
  const dbSchema = localStorage.getItem("serverSchema");
  return request({
    url: `/crud/getPrimaryKey`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userProfile.token}`,
    },
    data: JSON.stringify({
      tableName: table,
      schema: dbSchema,
    }),
  });
}

function downloadTemplate({ userProfile, table }) {
  const dbSchema = localStorage.getItem("serverSchema");
  return request({
    url: `/crud/downloadTemplate`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userProfile.token}`,
    },
    responseType: "blob",
    data: JSON.stringify({
      tableName: table,
      schema: dbSchema,
    }),
  })
    .then((response) => {
      // Create a link element
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/vnd.ms-excel" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${table}.xls`); // Set the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch((error) => {
      console.error("Error downloading the file", error);
    });
}

function updateTableData({ userProfile, tableName, poCode, editData }) {
  const dbSchema = localStorage.getItem("serverSchema");

  return request({
    url: `/crud/updateTable`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userProfile.token}`,
    },
    data: JSON.stringify({
      schema: dbSchema,
      tableName: tableName,
      key: poCode,
      data: editData,
    }),
  });
}

function templateUpload({ userProfile, tableName, file, opsType }) {
  const formData = new FormData();
  const dbSchema = localStorage.getItem("serverSchema");

  formData.append("tableName", tableName);
  formData.append("schema", dbSchema);
  formData.append("file", file);
  formData.append("opsType", opsType);

  return request({
    url: `/crud/uploadTemplate`,
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${userProfile.token}`,
    },
    data: formData,
  });
}

function getDependentKeyValue({ userProfile, table }) {
  const dbSchema = localStorage.getItem("serverSchema");
  return request({
    url: `/crud/getDependentKeyValue`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userProfile.token}`,
    },
    data: JSON.stringify({
      tableName: table,
      schema: dbSchema,
    }),
  });
}

function saveTableData({ userProfile, table, newData }) {
  const dbSchema = localStorage.getItem("serverSchema");
  console.log("table", table);
  return request({
    url: `/crud/saveNewData`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userProfile.token}`,
    },
    data: JSON.stringify({
      tableName: table,
      schema: dbSchema,
      data: [newData],
    }),
  });
}

const CRUDService = {
  getTables,
  getTableData,
  updateTableData,
  downloadTemplate,
  templateUpload,
  getPrimaryKey,
  getDependentKeyValue,
  saveTableData,
};

export default CRUDService;
