import axios from "@/utils/axiosConfig";

export const fetchSubscription = async () => {
  try {
    const response = await axios.get('/institution/updated-subscription'); // Replace with your actual endpoint
    return response.data.subscription; // Adjust based on your API structure
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
};
