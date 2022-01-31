import type { Config, EncType, Method } from '../types'

interface CreateRequestInitParams {
  action: string
  baseConfig: Config
  method?: Method
  encType?: EncType
  formData: FormData
  reqBody?: string
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
  action,
  baseConfig,
  method,
  encType,
  formData,
  reqBody,
  query = '',
}: CreateRequestInitParams) {
  // set default `headers` value
  const headers: any = {}
  // set default `body` value as `formData`
  let body: FormData | string | undefined = formData
  // define request params
  let requestParam = ''

  /** define request `encType` */
  const reqEncType =
    encType || baseConfig.encType || 'application/x-www-form-urlencoded'

  /** define request `method` */
  const requestMethod: Method =
    method === 'graphql'
      ? 'post'
      : method === undefined && baseConfig.method === 'graphql'
      ? 'post'
      : method || baseConfig.method || 'get'

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
    body = query
  }

  /**
   * if `encType` is `application/json`,
   * 1. set headers `Context-Type` to `application/json`
   * 2. set `body` to JSON.stringify value of the formData object
   */
  if (reqEncType === 'application/json') {
    headers['Content-Type'] = `${reqEncType};charset=UTF-8`
    const json: any = {}
    for (const entity of formData.entries()) {
      json[entity[0]] = entity[1].toString()
    }
    body = JSON.stringify(json)
  }

  /**
   * if `reqBody` is not empty,
   * 1. set headers `Context-Type` to `application/json`
   * 2. set `body` to `reqBody`
   */
  if (reqBody !== undefined) {
    headers['Context-Type'] = 'application/json;charset=UTF-8'
    body = reqBody
  }

  /**
   * if `method` is `graphql`,
   * 1. set headers `Content-Type` to `application/json`
   * 2. serialize body with `query` and `variables`
   */
  if (method === 'graphql') {
    headers['Content-Type'] = 'application/json;charset=UTF-8'
    const variables: any = {}
    for (const entity of formData.entries()) {
      variables[entity[0]] = entity[1].toString()
    }
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
    requestParam = params.toString()
  }

  /** Prepare the request init object */
  // eslint-disable-next-line no-undef
  const requestInit: RequestInit = {
    method: requestMethod,
    headers,
  }

  /** Request URL */
  const url = baseConfig.baseUrl
    ? `${baseConfig.baseUrl}${action}${requestParam}`
    : `${action}${requestParam}`

  // if requestMethod is not `get`, set `body` to the request init object
  if (requestMethod !== 'get') requestInit.body = body

  return {
    url,
    requestInit,
  }
}
