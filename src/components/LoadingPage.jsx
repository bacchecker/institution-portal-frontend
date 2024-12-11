import { useState } from "react";
import { DotLoader } from "react-spinners";

const LoadingPage = () => {
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#ff0404");
  return (
    <div className="loading-div-active">
      <DotLoader
        color={color}
        loading={loading}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};
export default LoadingPage;
