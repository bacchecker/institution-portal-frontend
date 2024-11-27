const getInitials = (name) => {
  const nameParts = name.trim().split(" ");

  const initials = nameParts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return initials;
};

export default getInitials;
