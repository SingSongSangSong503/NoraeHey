import axios from 'axios';

const baseURL = 'https://t8c01.p.ssafy.io';

const getAccessToken = () => {
  const accessToken = sessionStorage.getItem('accessToken');
  return accessToken;
};
const getLocalRefreshToken = () => {
  const refreshToken = localStorage.getItem('refreshToken');
  return refreshToken;
};

export const setRefreshToken = (refreshToken: string) => {
  localStorage.setItem('refreshToken', refreshToken);
};

export const removeRefreshToken = () => {
  localStorage.removeItem('refreshToken');
};

export const removeAccessToken = () => {
  sessionStorage.removeItem('accessToken');
};

const getNewAccessToken = async () => {
  const refreshtoken = getLocalRefreshToken();
  const result = await axios.get(`${baseURL}/api/v1/member/refresh`, {
    headers: {
      'REFRESH-TOKEN': `${refreshtoken}`,
    },
  });
  return result;
};

export const instance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config: any) => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    if (err.response) {
      if (
        err.response.status === 401 &&
        err.response.data?.error === 'TokenExpiredException'
      ) {
        try {
          const response = await getNewAccessToken();
          const { accessToken, refreshToken } = response.data;
          sessionStorage.setItem('accessToken', accessToken);
          setRefreshToken(refreshToken);
          console.log(accessToken, refreshToken);
          instance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          return instance(originalConfig);
        } catch (err: any) {
          if (
            err.response.status === 401 &&
            err.response.data?.message === 'REFRESH_ERROR'
          ) {
            removeAccessToken();
            removeRefreshToken();
            setTimeout(() => {
              window.location.href = '/login';
            }, 100);
            return;
          }
          return Promise.reject(err);
        }
      }
      return Promise.reject(err);
    }
    return Promise.reject(err);
  },
);

export const fetchData = {
  get: async (url: string, option?: any) => await instance.get(url, option),
  post: async (url: string, body?: any, option?: any) =>
    await instance.post(url, body, option),
  put: async (url: string, body?: any, option?: any) =>
    await instance.put(url, body, option),
  patch: async (url: string, body?: any, option?: any) =>
    await instance.patch(url, body, option),
  delete: async (url: string, option?: any) =>
    await instance.delete(url, option),
};
