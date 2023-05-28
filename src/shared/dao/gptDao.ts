import axios from "axios";
import { CONFIG } from "../config/config";

const API_KEY = CONFIG.API_KEY;
const ENDPOINT = "https://api.openai.com/v1/chat/completions";

export const useGptDao = () => {
  const sendMessage = async (payload: any) => {
    const response = await axios.post(ENDPOINT, payload, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  };

  return {
    sendMessage,
  };
};
