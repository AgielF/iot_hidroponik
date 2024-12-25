import { API_BASE_URL } from "../config/config";

export const getData = async (endpoint) => {
  try {
    console.log(`[REST API] Sending request to: ${API_BASE_URL}/${endpoint}`);
    const response = await fetch(`${API_BASE_URL}/${endpoint}`);
    console.log(`[REST API] Response status: ${response.status}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("[REST API] Data received:", data);
    return data;
  } catch (error) {
    console.error("[REST API] Error fetching data:", error);
    throw error;
  }
};
