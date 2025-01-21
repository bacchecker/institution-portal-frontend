import secureLocalStorage from "react-secure-storage";

export const getAccountStatus = () => {
  const user = JSON.parse(secureLocalStorage.getItem("user"));

  if (!user?.institution) return null;

  const currentStep = parseInt(user.institution.current_step) || 1;
  const setupDone = user.institution.setup_done === true || currentStep === 5;

  return {
    isActive: user.institution.status === "active",
    isInactive: user.institution.status === "inactive",
    setupDone,
    currentStep,
    hasValidStatus: typeof user.institution.status === "string",
    hasValidSetup:
      typeof user.institution.setup_done === "boolean" || currentStep === 5,
  };
};
