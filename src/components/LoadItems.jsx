import { ClipLoader } from "react-spinners";

const LoadItems = ({ color, size }) => {
  return (
    <ClipLoader
      color={color || "#dfdede"}
      loading={true}
      size={size || 20}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
};
export default LoadItems;
