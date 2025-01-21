import React from "react";
import { Oval } from "react-loader-spinner";

const LoadItems = ({ color = "red", size = 30 }) => {
  return (
    <Oval
      height={size}
      width={size}
      color={color}
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      ariaLabel="oval-loading"
      secondaryColor="#ccc"
      strokeWidth={4}
      strokeWidthSecondary={4}
    />
  );
};

export default LoadItems;
