/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  type AxiosResponse,
  type AxiosRequestConfig,
  type AxiosBasicCredentials,
  type ResponseType,
} from "axios";
import { STORAGE_KEYS } from "./constants";

export interface IRequestOptions {
  headers?: any;
  basicAuth?: AxiosBasicCredentials;
  responseType?: ResponseType;
  data?: any;
}

const baseUrl = "/api";

export const onLogout = (): void => {
  sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  // navigate to login page
};

const onRequest = (
  config: AxiosRequestConfig<unknown>
): AxiosRequestConfig<unknown> => {
  // eslint-disable-next-line no-constant-binary-expression
  if (Boolean(config.url) ?? false) {
    const authToken = JSON.parse(
      sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) as string
    );
    if (authToken !== null && authToken?.length > 0) {
      if (config.headers) {
        config.headers.Authorization = "Bearer " + authToken;
      }
    }
  }
  return config;
};

const onResponseSuccess = (
  response: any
): AxiosResponse<any, any> | Promise<AxiosResponse<any, any>> => {
  endRequest();
  return response;
};

const onResponseError = async (err: any): Promise<any> => {
  endRequest();

  if (err.response?.status === 401) {
    onLogout();
  } else if (err.response?.status === 403) {
    // handle unauthorized error
  }

  return await Promise.reject(err);
};

export const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 1000 * 60 * 5,
  validateStatus: function (status: number) {
    return status === 200 || status === 201 || status === 204;
  },
});

axiosInstance?.interceptors?.request.use(onRequest as any);
axiosInstance?.interceptors?.response.use(onResponseSuccess, onResponseError);

let onRequestStart: () => void;
let onRequestEnd: () => void;
let totalRequests = 0;
let completedRequests = 0;

const startRequest = (displayLoader = true): void => {
  if (displayLoader) {
    onRequestStart?.();
  }
  totalRequests += 1;
};

const endRequest = (): void => {
  completedRequests += 1;
  if (completedRequests === totalRequests) {
    onRequestEnd?.();
  }
};

export function addRequestStartListener(callback: () => void): void {
  onRequestStart = callback;
}
export function addRequestEndListener(callback: () => void): void {
  onRequestEnd = callback;
}

export async function Get<T, D>(
  endPoint: string,
  params?: D,
  requestOptions: IRequestOptions = {},
  displayLoader = true
): Promise<T> {
  startRequest(displayLoader);
  const res = await axiosInstance.get<T, AxiosResponse<T>, D>(endPoint, {
    params,
    headers: requestOptions.headers,
    responseType: requestOptions.responseType,
  });
  return res?.data;
}

export async function Post<T, D>(
  endPoint: string,
  data?: D,
  requestOptions: IRequestOptions = {},
  displayLoader = true
): Promise<AxiosResponse<T>> {
  startRequest(displayLoader);
  const res = await axiosInstance.post<T, AxiosResponse<T>, D>(endPoint, data, {
    headers: requestOptions.headers !== null ? requestOptions.headers : {},
    auth: requestOptions.basicAuth,
  });
  return res;
}

export async function Put<T, D>(
  endPoint: string,
  data: D,
  requestOptions: IRequestOptions = {},
  displayLoader = true
): Promise<T> {
  startRequest(displayLoader);
  const res = await axiosInstance.put<T, AxiosResponse<T>, D>(endPoint, data, {
    headers: requestOptions.headers,
  });
  return res?.data;
}

export async function Delete<T, D>(
  endPoint: string,
  data: D,
  requestOptions: IRequestOptions = {},
  displayLoader = true
): Promise<T> {
  startRequest(displayLoader);
  const res = await axiosInstance.delete<T, AxiosResponse<T>, D>(endPoint, {
    headers: requestOptions.headers,
    data,
  });
  return res?.data;
}
