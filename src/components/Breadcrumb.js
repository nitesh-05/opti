import React, { useEffect, useLayoutEffect, useState } from "react";

const BreadCrumb = ({mainMenu,subMainMenu}) => {

return (
    <>
      <ol className="breadcrumb" style={{ marginBottom: "0px", marginTop: "20px",padding:"0px 0px" }}>
        <li className="breadcrumb-item">{mainMenu}</li>
        <li className="breadcrumb-item active">{subMainMenu}</li>
      </ol>
    </>


);


}

export default BreadCrumb;