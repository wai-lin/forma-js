import { EncType, Method } from "./types";

export function makeRequest(url: string, request: RequestInit = {}) {
  return fetch(url, request);
}

interface CreateRequestInitParams {
  method: Method;
  encType: EncType;
  formData: FormData;
  reqBody?: string;
  query?: string;
}

/**
 * Generate the request headers and body based on the `encType` and `reqBody`.
 * The function will serialize the `formData` to appropriate `body` type based on `encType` value.
 *
 * When `reqBody` is not empty, the `Content-Type` header will be set to `application/json` by force
 * and `reqBody` will be used as the `body`. So the `reqBody` needs to be a valid JSON string.
 */
export function createRequestInit({
  method = "post",
  encType,
  formData,
  reqBody,
  query = "",
}: CreateRequestInitParams) {
  // set default `headers` value
  let headers: any = {};
  // set default `body` value as `formData`
  let body: FormData | string = formData;

  /**
   * if `encType` is `application/x-www-form-urlencoded`,
   * 1. set headers `Context-Type` to `application/x-www-form-urlencoded`
   * 2. create a form-urlencoded string and set it as `body`
   */
  if (encType === "application/x-www-form-urlencoded") {
    headers["Content-Type"] = `${encType};charset=UTF-8`;
    const query = new URLSearchParams();
    for (let entity of formData.entries()) {
      query.append(entity[0], entity[1].toString());
    }
    body = query;
  }

  /**
   * if `encType` is `application/json`,
   * 1. set headers `Context-Type` to `application/json`
   * 2. set `body` to JSON.stringify value of the formData object
   */
  if (encType === "application/json") {
    headers["Content-Type"] = `${encType};charset=UTF-8`;
    const json: any = {};
    for (let entity of formData.entries()) {
      json[entity[0]] = entity[1].toString();
    }
    body = JSON.stringify(json);
  }

  /**
   * if `reqBody` is not empty,
   * 1. set headers `Context-Type` to `application/json`
   * 2. set `body` to `reqBody`
   */
  if (reqBody !== undefined) {
    headers["Context-Type"] = "application/json;charset=UTF-8";
    body = reqBody;
  }

  /**
   * Change request method to `post` if method type if `graphql`
   */
  const requestMethod = method === "graphql" ? "post" : method;

  /**
   * if `method` is `graphql`,
   * 1. set headers `Content-Type` to `application/json`
   * 2. serialize body with `query` and `variables`
   */
  if (method === "graphql") {
    headers["Content-Type"] = "application/json;charset=UTF-8";
    const variables: any = {};
    for (let entity of formData.entries()) {
      variables[entity[0]] = entity[1].toString();
    }
    body = JSON.stringify({ query, variables });
  }

  return { method: requestMethod, headers, body };
}
