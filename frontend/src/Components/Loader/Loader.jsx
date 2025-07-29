import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen text-center">
      <div className="spinner-box ">
        <div className="circle-border">
          <div className="circle-core"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
