import secureLocalStorage from "react-secure-storage";

export const getAccountSetupStatus = () => {
  const user = JSON.parse(secureLocalStorage.getItem("user"));

  if (!user) return false;

  const setupDone = user?.institution?.setup_done;
  const currentStep = parseInt(user?.institution?.current_step);

  return {
    isSetupComplete: setupDone === true,
    currentStep: currentStep || 1,
    needsSetup: !setupDone,
  };
};
