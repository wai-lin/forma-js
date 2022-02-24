import type { Config, EncType, Headers, Method } from '../types'

interface CreateRequestInitParams {
  /** @deprecated */
  useBaseConfig?: boolean
  action: string
  baseConfig: Config
  method?: Method
  encType?: EncType
  formData: FormData
  reqHeaders?: Headers
  reqBody?: { [key: string]: any }
  transform?: (data: { [key: string]: any }) => any
  query?: string
}

/**
 * Generate the request headers and body based on the `encType` and `reqBody`.
 * The function will serialize the `formData` to appropriate `body` type based on `encType` value.
 *
 * When `reqBody` is not empty, the `Content-Type` header will be set to `application/json` by force
 * and `reqBody` will be used as the `body`. So the `reqBody` needs to be a valid JSON string.
 */
export function createRequestInit({
  useBaseConfig = true,
  action,
  baseConfig,
  method,
  encType,
  formData,
  reqHeaders,
  reqBody,
  transform,
  query = '',
}: CreateRequestInitParams) {
  // set default `headers` value
  const headers: Headers = reqHeaders || {}
  // set default `body` value as `formData`
  let body: FormData | string | undefined = formData
  // define request params
  let requestParam = ''

  /** define request `encType` */
  let reqEncType =
    encType || baseConfig.encType || 'application/x-www-form-urlencoded'

  /** define request `method` */
  let requestMethod: Method =
    method === 'graphql'
      ? 'post'
      : method === undefined && baseConfig.method === 'graphql'
      ? 'post'
      : method || baseConfig.method || 'post'

  // TODO: remove, deprecated
  if (!useBaseConfig) {
    reqEncType = encType || 'application/x-www-form-urlencoded'
    requestMethod = method || 'post'
  }

  /**
   * if `encType` is `application/x-www-form-urlencoded`,
   * 1. set headers `Context-Type` to `application/x-www-form-urlencoded`
   * 2. create a form-urlencoded string and set it as `body`
   */
  if (reqEncType === 'application/x-www-form-urlencoded') {
    headers['Content-Type'] = `${reqEncType};charset=UTF-8`
    const query = new URLSearchParams()
    for (const entity of formData.entries()) {
      query.append(entity[0], entity[1].toString())
    }
    for (const key in reqBody) {
      query.append(key, reqBody[key])
    }
    body = query
  }

  /**
   * if `encType` is `application/json`,
   * 1. set headers `Context-Type` to `application/json`
   * 2. set `body` to JSON.stringify value of the formData object
   */
  if (reqEncType === 'application/json') {
    headers['Content-Type'] = `${reqEncType};charset=UTF-8`
    let json: any = {}
    for (const entity of formData.entries()) {
      json[entity[0]] = entity[1].toString()
    }
    for (const key in reqBody) {
      json[key] = reqBody[key]
    }
    if (transform) json = transform(json)
    body = JSON.stringify(json)
  }

  /**
   * if `method` is `graphql`,
   * 1. set headers `Content-Type` to `application/json`
   * 2. serialize body with `query` and `variables`
   */
  if (method === 'graphql') {
    headers['Content-Type'] = 'application/json;charset=UTF-8'
    let variables: any = {}
    for (const entity of formData.entries()) {
      variables[entity[0]] = entity[1].toString()
    }
    for (const key in reqBody) {
      variables[key] = reqBody[key]
    }
    if (transform) variables = transform(variables)
    body = JSON.stringify({ query, variables })
  }

  /**
   * if `method` is `get`,
   * 1. set body to `undefined` to prevent `fetch` request `body` error
   * 2. set `requestParam` to `query`
   */
  if (requestMethod === 'get') {
    body = undefined
    const params = new URLSearchParams()
    for (const entity of formData.entries()) {
      params.append(entity[0], entity[1].toString())
    }
    for (const key in reqBody) {
      params.append(key, reqBody[key])
    }
    requestParam = params.toString()
  }

  /** Prepare the request init object */
  // eslint-disable-next-line no-undef
  const requestInit: RequestInit = {
    method: requestMethod,
    headers,
  }

  const isSearchParamNeeded = !/\?$/g.test(action) && method === 'get'
  const searchParam = isSearchParamNeeded ? '?' : ''

  /** Request URL */
  let url = baseConfig.baseUrl
    ? `${baseConfig.baseUrl}${action}${searchParam}${requestParam}`
    : `${action}${searchParam}${requestParam}`

  let formUrl = baseConfig.baseUrl
    ? `${baseConfig.baseUrl}${action}`
    : `${action}`

  // TODO: remove, deprecated
  if (!useBaseConfig) {
    url = `${action}${searchParam}${requestParam}`
    formUrl = `${action}`
  }

  // if requestMethod is not `get`, set `body` to the request init object
  if (requestMethod !== 'get') requestInit.body = body

  return {
    url,
    formUrl,
    method: requestInit.method as Omit<Method, 'graphql'>,
    encType: headers['Content-Type'] as EncType,
    requestInit,
  }
}
