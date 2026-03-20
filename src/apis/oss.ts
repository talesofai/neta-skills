import type { AxiosInstance } from "axios";

export interface Credentials {
  /**
   * STS access key id.
   */
  access_key_id: string;

  /**
   * STS access key secret.
   */
  access_key_secret: string;

  /**
   * STS token.
   */
  security_token: string;

  /**
   * STS expiration UTC time in ISO format.
   */
  expiration: string;

  path: string;
}

export const createOssApis = (client: AxiosInstance) => {
  const getStsCredentials = async (suffix: string) => {
    const res = await client.get<Credentials>("/v1/oss/sts-upload-token", {
      params: {
        suffix,
      },
    });
    return res.data;
  };

  const getVideoStsCredentials = async (suffix: string) => {
    const res = await client.get<Credentials>(
      "/v1/oss/anonymous-upload-token",
      {
        params: {
          suffix,
        },
      },
    );
    return res.data;
  };

  return {
    getStsCredentials,
    getVideoStsCredentials,
  };
};
