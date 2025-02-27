import axios from "@/utils/axiosConfig";

export const fetchSubscription = async () => {
  try {
    const response = await axios.get('/institution/verification/dashboard-data'); // Replace with your actual endpoint
    return response.data; // Adjust based on your API structure
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
};
