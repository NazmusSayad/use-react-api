import axios from 'axios'

export const axiosMethods = [
  'request',
  'get',
  'delete',
  'head',
  'options',
  'post',
  'put',
  'patch',
] as const

export type AxiosMethodsKeys = typeof axiosMethods[number]

export type AxiosMethodsCore = {
  [Key in keyof Record<AxiosMethodsKeys, any>]: typeof axios[Key]
}

export type AxiosMethodsCoreParams = Parameters<AnyAxiosMethodCore>

export type AnyAxiosMethodCore = AxiosMethodsCore[keyof AxiosMethodsCore]
