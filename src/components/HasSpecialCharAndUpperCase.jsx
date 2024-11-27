const hasSpecialCharAndUpperCase = (password) => {
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  const upperCaseRegex = /[A-Z]/;
  return specialCharRegex.test(password) && upperCaseRegex.test(password);
};

export default hasSpecialCharAndUpperCase;
