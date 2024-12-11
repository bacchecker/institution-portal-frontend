const formatText = (input) => {
  return input
    ?.replace(/_/g, " ")
    ?.replace(/\b\w/g, (char) => char?.toUpperCase());
};
export default formatText;
