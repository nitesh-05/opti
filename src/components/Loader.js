import React, { useEffect} from "react";
import LoaderImg from "react-spinners/BeatLoader";

const Loader = ({loading}) => {
 
    return(
        <div style={{
            position: "fixed",
            //background: "rgba(0,0,0,0.6)",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1005,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: '500px'

        }}>
        <LoaderImg
            color={"#373c91"}
            loading={loading}
            size={10}
            aria-label="Loading Spinner"
            
        /> Loading Please Wait....</div>

    )


    

}

export default Loader;