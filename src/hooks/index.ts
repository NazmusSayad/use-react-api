import { useMemo } from 'react'
import { RootMethods } from '../creator/createRoot.js'
import { AxiosMethodsCoreParams, AxiosMethodsKeys } from '../config.js'
import { getLastFunction } from './utils.js'
import useApiCore from './useApiCore.js'
import useApiOnce, { UseApiOnceOnLoadFn } from './useApiOnce.js'
import useSuspenseApi, {
  SuspenseApiOnceRequests,
  SuspenseStore,
  UseSuspenseApiOnLoadFn,
} from './useSuspenseApi.js'
import useSuspense from '../heplers/useSuspense.js'

export default (rootMethods: RootMethods) => {
  return {
    useApi({ suspense = false }: UseApiParams = {}) {
      const api = useApiCore(rootMethods)
      useSuspense(suspense && api.status.loading)
      return useMemo(
        () => ({
          ...api.status,
          ...api.methods,
          status: api.status,
          setStatus: api.setStatus,
          methods: api.methods,
        }),
        [api.status]
      )
    },

    useApiOnce(
      method: UseSuspenseApiParams[0],
      ...axiosArgs: UseSuspenseApiParams[1]
    ) {
      const [args, onLoad] = getLastFunction(axiosArgs)
      return useApiOnce(rootMethods, method, args, onLoad)
    },

    createSuspenseApi({ cache = false }: CreateSuspenseApiParams = {}) {
      const store: SuspenseStore = { cache }

      return (...requests: UseApiOnceParams) => {
        const [args, onLoad] = getLastFunction(requests)
        if (args.length === 0) {
          throw new Error('Please provide at least one request array.')
        }
        return useSuspenseApi(rootMethods, store, args, onLoad)
      }
    },
  }
}

export type CreateSuspenseApiParams = {
  cache?: boolean
}

export type UseApiParams = {
  suspense?: boolean
}

export type UseSuspenseApiParams = [
  AxiosMethodsKeys,
  AxiosMethodsCoreParams | [...AxiosMethodsCoreParams, UseApiOnceOnLoadFn]
]

export type UseApiOnceParams =
  | SuspenseApiOnceRequests
  | [...SuspenseApiOnceRequests, UseSuspenseApiOnLoadFn]
