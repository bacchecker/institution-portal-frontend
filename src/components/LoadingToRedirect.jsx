import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function LoadingToRedirect() {
  const navigate = useNavigate();
  const [count, setCount] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => currentCount - 1);
    }, 1000);
    count === 0 && navigate("/");
    return () => clearInterval(interval);
  }, [count, navigate]);

  return (
    <div className="w-full h-[100dvh] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <h1 className="text-[#ff0404] md:text-[1.2vw] text-[5vw]">Not Authenticated</h1>
        <h4 className="md:text-[1vw] text-[4vw]">Redirecting you in <span className="text-[#ff0404]">{count}</span> secs</h4>
      </div>
    </div>
  );
}

export default LoadingToRedirect;
