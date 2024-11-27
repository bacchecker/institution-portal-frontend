const validateEmail = (email) => {
  const excludedDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
  ];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }

  const domain = email.split("@")[1];
  if (excludedDomains.includes(domain)) {
    return `Email with domain ${domain} is not allowed`;
  }

  return "";
};
export default validateEmail;
