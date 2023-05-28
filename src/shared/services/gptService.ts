/* eslint-disable react-hooks/rules-of-hooks */

import { useGptDao } from "../dao/gptDao";
import { useMutation } from "@tanstack/react-query";

export const useGptService = () => {
  const { sendMessage: sendMessageDao } = useGptDao();

  const sendMessage = () => {
    const sendMutation = useMutation((payload) => sendMessageDao(payload));

    return {
      sendMutation,
    };
  };

  return {
    sendMessage,
  };
};
