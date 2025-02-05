import secureLocalStorage from "react-secure-storage";

export const getAccountSetupStatus = () => {
  const user = JSON.parse(secureLocalStorage.getItem("user"));

  if (!user) return false;

  const setupDone = user?.institution?.setup_done;
  const currentStep = parseInt(user?.institution?.current_step);

  // Consider setup complete if either setup_done is true OR currentStep is 5
  const isSetupComplete = setupDone === true || currentStep === 5;

  return {
    isSetupComplete,
    currentStep: currentStep || 1,
    needsSetup: !isSetupComplete,
  };
};
