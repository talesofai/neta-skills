import type { AxiosInstance } from "axios";
import type { LLMMessage } from "./types.ts";

export const createGptApis = (client: AxiosInstance) => {
  const messages = async (uuid: string) => {
    return client
      .get<LLMMessage>(`/v3/gpt/message/${uuid}`)
      .then((res) => res.data);
  };

  return {
    messages,
  };
};
