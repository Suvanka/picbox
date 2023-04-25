// axios拦截器配置，封装axios请求方法
import axios from 'axios'
import { Alert } from '../util/alert'
import { FormatMessage } from '../util/util'
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

class xwlRequest {
  instance: AxiosInstance
  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config)
    // axios拦截器，在请求头添加token
    this.instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        let token = localStorage.getItem('token')
        if (token) {
          config.headers = {Authorization: `token ${token}`}
        }
        return config
      },
      (error) => {
        console.log(error)
        return Promise.reject(error)
      }
    )
    // axios拦截器，处理响应的错误信息
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      (error) => {
        if (error.response.data.message != 'Not Found') {
          Alert({
            type: 'danger',
            text: FormatMessage(error.response.data.message),
          })
        }
        return Promise.reject(error)
      }
    )
  }
  // 封装axios的请求方法
  request<T>(config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      this.instance.request<any, T>(config).then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
        return err
      })
    })
  }
  // 封装axios的get、put、post、patch、delete方法
  get<T>(config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' })
  }
  put<T>(config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT' })
  }
  post<T>(config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' })
  }
  patch<T>(config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH' })
  }
  delete<T>(config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' })
  }
}
export default xwlRequest
