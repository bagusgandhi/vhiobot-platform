import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { notification } from 'antd';

interface Session {
  data?: {
    accessToken?: string;
  };
}

interface UseSWRMutationFetcherProps<T> {
  key: string | [string, AxiosRequestConfig?];
  session?: Session;
  swrOptions?: SWRMutationConfiguration<T, any>;
  axiosOptions?: AxiosRequestConfig;
  allRes?: boolean;
}

export function useSWRMutationFetcher<T>({
  key,
  session,
  swrOptions,
  axiosOptions,
  allRes = false,
}: any) {
  return useSWRMutation<T>(
    key,
    async (key: string | [string, AxiosRequestConfig?], { arg: triggerArgs }: { arg: AxiosRequestConfig }) => {
      const url = Array.isArray(key) ? key[0] : key;
      const additionalConfig = Array.isArray(key) && key[1] ? key[1] : {};
      const axiosConfig: AxiosRequestConfig = {
        url,
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: { Authorization: `Bearer ${session?.data?.accessToken}` },
        // ...((typeof key === 'object' && !Array.isArray(key) && key !== null) && key),
        ...additionalConfig,
        ...axiosOptions,
        ...triggerArgs,
      };
      const response: AxiosResponse = await axios(axiosConfig);
      return allRes ? response : response.data;
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onError: (err: any, key: any, config: any) => {
        notification.error({
          message: err?.response?.data?.error ?? 'Error!',
          description: err?.response?.data?.message ?? err?.message,
        });
      },
      ...swrOptions,
    }
  );
}
