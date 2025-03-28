import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { userType } from "../constants/constants";
import Swal from "sweetalert2";
import BuildMenus from "../components/DashBoard/BuildMenus";
import { FileUploader } from "react-drag-drop-files";
import FormData from "form-data";
import "../custom_css/uploadPO.css";
import uImg from "../icons/upload.jpg";
import request from "../axios/shared/lib/request";
import BreadCrumb from "../components/Breadcrumb";

const UploadPO = () => {
  const fileTypes = ["JPG", "PNG", "GIF", "PDF"];

  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showProgress, setShowProgress] = useState(false);
  const fileInputRef = useRef(null);
 

  const userProfile = useSelector((state) => state.userProfile);

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const headers = {
    headers: {
      'Content-Type': 'application/multipart/form-data',
      Authorization: `Bearer ${userProfile.token}`
    }
  };


  const uploadFile = (event) => {
    const file = event.target.files[0];
   

    if (!file) return;
    const fileName = file.name.length > 12 ? `${file.name.substring(0, 13)}... .${file.name.split('.')[1]}}` : file.name;
    const formData = new FormData();
    
    formData.append('files', file);
    

    setFiles(prevState => [...prevState, { name: fileName, loading: 0 }]);
    console.log(files);
    setShowProgress(true);


    return request({
      url: `/upload`,
      method: "POST",
      onUploadProgress: ({ loaded, total }) => {

        setFiles(prevState => {
          const newFiles = [...prevState];
          newFiles[newFiles.length - 1].loading = Math.floor((loaded / total) * 100);

          return newFiles;

        });
        if (loaded === total) {
          const fileSize = total < 1024 ? `${total} KB` : `${(loaded / (1024 * 1024)).toFixed(2)} MB`;
          setUploadedFiles([...uploadedFiles, { name: fileName, size: fileSize }]);
          setFiles([]);
          setShowProgress(false);
        }

      },
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userProfile.token}`
      },

      data: formData,

    });
  };


  return (
    <div>
      <BreadCrumb mainMenu="Transaction" subMainMenu="Upload PO"/>
      <body className='container'>
        <div className="upload-box">
          <p>Upload your file</p>
          <form>
            <input className='file-input' type='file' name='file' style={{ display: "none" }} ref={fileInputRef} onChange={uploadFile} multiple />
            <div className="icon" onClick={handleFileInputClick}>
              <img src={uImg} className='img' />
            </div>
            <p>Browse|Drop file to upload</p>
          </form>
          {showProgress && (
            <section className='loading-area'>
              {files.map((file, index) => {
                return (

                  <li className='row' key={index}>
                    <i className='fas fa-file-alt'>
                      <div className='content'>
                        <div className='details'>
                          <span className='name'>
                            {`${file.name} - uploading`}
                          </span>
                          <span className='percent'>
                            {`${file.loading}`}
                          </span>
                          <div className='loading-bar'>
                            <div className='loading' style={{ width: `${file.loading}%` }}>

                            </div>
                          </div>
                        </div>
                      </div>
                    </i>
                  </li>
                )
              })}

            </section>
          )}
          <section className='uploaded-area'>
            {uploadedFiles.map((file, index) => {
              return (
                <li className='row' key={index}>
                  <div className='content upload'>
                    <i className='fas fa-file-alt'></i>
                    <div className='details'>
                      <span className='name'>{file.name}</span>
                      <span className='size'>{file.size}</span>

                    </div>
                  </div>
                  <i className='fas fa-check'></i>
                </li>

              )
            })}


          </section>


        </div>
      </body>
    </div>

  );

}

export default UploadPO;