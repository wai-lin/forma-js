import type {
  EncType,
  Headers,
  LifeCycleFuncs,
  Method,
  ResponseParam,
  Transition,
  TransitionState,
} from '../types'

import * as React from 'react'
import { createRequestInit } from '../utils/createRequestInit'
import { useConfig } from '../ConfigProvider/ConfigProvider'

export interface UseFetchParams<DataType, ErrorType> {
  /** @deprecated */
  useBaseConfig?: boolean
  action: string
  method: Method
  encType: EncType
  formData: FormData
  headers?: Headers
  body?: { [key: string]: any }
  query?: string
  transform?: (data: { [key: string]: any }) => any
  hook?: LifeCycleFuncs<DataType, ErrorType>
}

/**
 * Make a fetch request with native fetch API.
 * AbortController is also implemented to cancel the simultaneous fetch request.
 */
export function useFetch<DataType, ErrorType>({
  useBaseConfig = true,
  action,
  method,
  formData,
  encType = 'multipart/form-data',
  headers = undefined,
  body = undefined,
  query,
  transform,
  hook,
}: UseFetchParams<DataType, ErrorType>) {
  const firstRender = React.useRef(true)

  /**
   * base config
   * @deprecated
   */
  const baseConfig = useConfig()

  /**
   * submit and abort controller states
   */
  const [submit, setSubmit] = React.useState(false)
  const [abort, setAbort] = React.useState(false)

  /**
   * fetch request states
   */
  const [status, setStatus] = React.useState(0)
  const [data, setData] = React.useState<DataType | null>(null)
  const [error, setError] = React.useState<ErrorType | null>(null)
  const [transitionState, setTransitionState] =
    React.useState<TransitionState>('idle')

  const requestObj = React.useMemo(
    () =>
      createRequestInit({
        useBaseConfig,
        baseConfig,
        action,
        method,
        encType,
        formData,
        reqBody: body,
        query,
        reqHeaders: headers,
        transform,
      }),
    [
      action,
      baseConfig,
      body,
      encType,
      formData,
      headers,
      method,
      query,
      transform,
      useBaseConfig,
    ],
  )

  /**
   * fetch request, controller
   */
  React.useEffect(() => {
    /**
     * Declare new AbortController on every request
     * AbortController needs to initialize again to renew the abort state
     */
    const controller = new AbortController()
    const signal = controller.signal

    /**
     * 1. Prevent fetching on first render with useRef
     * 2. Fetch request on submit is `true`
     * 3. Or Re-Fetch request when abort is `true` (which simulate the continuous clicking submit button)
     */
    if (!firstRender.current && (submit || abort)) {
      /**
       * Generate request `headers` and `body`
       */
      const requestObj = createRequestInit({
        useBaseConfig,
        action,
        baseConfig,
        method,
        encType,
        formData,
        reqBody: body,
        query,
        reqHeaders: headers,
        transform,
      })

      /**
       * Reset states before submitting
       */
      setStatus(0)
      setData(null)
      setError(null)
      setTransitionState('idle')

      // SECTION: Before Hook
      hook?.beforeRequest && hook.beforeRequest(requestObj.requestInit)

      setTransitionState('submitting')
      // Make fetch request
      fetch(requestObj.url, {
        ...requestObj.requestInit,
        signal,
      })
        .then(async (res) => {
          const response: ResponseParam<DataType> = {
            ...res,
            data: await res.json(),
          }

          setStatus(res.status)

          if (res.ok) {
            // SECTION: graphql
            if (method === 'graphql') {
              const data = (response.data as any).data
              const errors = response.data as any
              setData(data)
              setError(errors)

              if ((response.data as any).data === null)
                setTransitionState('error')
              else setTransitionState('idle')
            } else {
              // SECTION: On Success Hook
              hook?.onSuccess && hook.onSuccess(response)
              setData(response.data)
              setTransitionState('idle')
            }
          }

          // SECTION: On Error Hook
          if (!res.ok) {
            hook?.onError &&
              hook.onError({
                ...response,
                data: response.data as unknown as ErrorType,
              })
            setError(response.data as unknown as ErrorType)
            setTransitionState('error')
          }

          return res
        })
        // SECTION: On CatchError Hook
        .catch((err) => {
          hook?.onCatchError && hook.onCatchError(err)
          setTransitionState('catch-error')
        })

      // SECTION: After Hook
      hook?.afterRequest && hook.afterRequest()
    }

    /**
     * Abort fetch request on every `submit` and `abort` state changes
     */
    return () => {
      controller.abort()
      // SECTION: After Abort
      hook?.afterAbort && hook.afterAbort()
      setTransitionState('idle')
    }
  }, [
    abort,
    action,
    baseConfig,
    body,
    encType,
    formData,
    headers,
    hook,
    method,
    query,
    submit,
    transform,
    useBaseConfig,
  ])

  // Change the first render state to `false` after the first render
  if (firstRender.current) firstRender.current = false

  // abort fetch request
  const abortRequest = () => {
    setSubmit(false)
    setAbort(false)
  }

  return {
    request: requestObj,
    submit,
    setSubmit,
    abort,
    setAbort,
    status,
    data,
    error,
    abortRequest,
    transition: {
      state: transitionState,
      formData,
    } as Transition,
  }
}
