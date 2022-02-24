import type { Config } from '../../types'

import { createRequestInit } from '../createRequestInit'

const baseConfig: Config = {
  baseUrl: 'http://localhost:4000/api',
  encType: 'application/x-www-form-urlencoded',
  method: 'post',
}

const emptyBaseConfig: Config = {
  baseUrl: undefined,
  encType: undefined,
  method: undefined,
}

test('createRequestInit POST with baseConfig', () => {
  const formData = new FormData()
  formData.append('name', 'alex')
  const { url, requestInit } = createRequestInit({
    action: '/users',
    formData,
    baseConfig,
  })

  expect(url).toEqual('http://localhost:4000/api/users')
  expect(requestInit.method).toEqual('post')
  expect((requestInit.headers as any)['Content-Type']).toEqual(
    'application/x-www-form-urlencoded;charset=UTF-8',
  )
  expect(requestInit.body?.toString()).toEqual('name=alex')
})

test('createRequestInit POST with reqBody should merge with formData', () => {
  const formData = new FormData()
  formData.append('name', 'alex')
  const reqBody = { gender: 'male' }
  const { url, requestInit } = createRequestInit({
    action: 'http://localhost:4000/api/users',
    formData,
    reqBody,
    baseConfig: emptyBaseConfig,
  })

  expect(url).toEqual('http://localhost:4000/api/users')
  expect(requestInit.method).toEqual('post')
  expect((requestInit.headers as any)['Content-Type']).toEqual(
    'application/x-www-form-urlencoded;charset=UTF-8',
  )
  expect(requestInit.body?.toString()).toEqual('name=alex&gender=male')
})

test('createRequestInit POST with custom headers', () => {
  const formData = new FormData()
  formData.append('name', 'alex')
  const { url, requestInit } = createRequestInit({
    action: 'http://localhost:4000/api/users',
    formData,
    reqHeaders: { authorization: 'Bearer 123' },
    baseConfig: emptyBaseConfig,
  })

  expect(url).toEqual('http://localhost:4000/api/users')
  expect(requestInit.method).toEqual('post')
  expect((requestInit.headers as any)['Content-Type']).toEqual(
    'application/x-www-form-urlencoded;charset=UTF-8',
  )
  expect((requestInit.headers as any).authorization).toEqual('Bearer 123')
  expect(requestInit.body?.toString()).toEqual('name=alex')
})

test('createRequestInit GET with baseConfig', () => {
  const formData = new FormData()
  formData.append('name', 'alex')
  const { url, requestInit } = createRequestInit({
    action: '/users',
    method: 'get',
    formData,
    baseConfig,
  })

  expect(url).toEqual('http://localhost:4000/api/users?name=alex')
  expect(requestInit.method).toEqual('get')
  expect((requestInit.headers as any)['Content-Type']).toEqual(
    'application/x-www-form-urlencoded;charset=UTF-8',
  )
  expect(requestInit.body).toBe(undefined)
})

test('createRequestInit PUT with baseConfig, application/json', () => {
  const formData = new FormData()
  formData.append('name', 'alex')
  const { url, requestInit } = createRequestInit({
    action: '/users',
    method: 'put',
    encType: 'application/json',
    formData,
    baseConfig,
  })

  expect(url).toEqual('http://localhost:4000/api/users')
  expect(requestInit.method).toEqual('put')
  expect((requestInit.headers as any)['Content-Type']).toEqual(
    'application/json;charset=UTF-8',
  )
  expect(JSON.parse(requestInit.body as string)).toEqual({ name: 'alex' })
})

test('createRequestInit GraphQL with emptyBaseConfig', () => {
  const formData = new FormData()
  formData.append('name', 'alex')
  const { url, requestInit } = createRequestInit({
    action: 'http://localhost:3000/graphql',
    method: 'graphql',
    formData,
    query: `{ users { id } }`,
    baseConfig: emptyBaseConfig,
  })

  expect(url).toEqual('http://localhost:3000/graphql')
  expect(requestInit.method).toEqual('post')
  expect((requestInit.headers as any)['Content-Type']).toEqual(
    'application/json;charset=UTF-8',
  )
  expect(JSON.parse(requestInit.body as string)).toEqual({
    query: `{ users { id } }`,
    variables: { name: 'alex' },
  })
})

test('createRequestInit GraphQL with emptyBaseConfig, transform variables', () => {
  const formData = new FormData()
  formData.append('name', 'alex')
  formData.append('age', '20')
  const { url, requestInit } = createRequestInit({
    action: 'http://localhost:3000/graphql',
    method: 'graphql',
    formData,
    query: `{ users { id } }`,
    baseConfig: emptyBaseConfig,
    transform: (variables) => ({ ...variables, age: Number(variables.age) }),
  })

  expect(url).toEqual('http://localhost:3000/graphql')
  expect(requestInit.method).toEqual('post')
  expect((requestInit.headers as any)['Content-Type']).toEqual(
    'application/json;charset=UTF-8',
  )
  expect(JSON.parse(requestInit.body as string)).toEqual({
    query: `{ users { id } }`,
    variables: { name: 'alex', age: 20 },
  })
})

test('createRequestInit POST with emptyBaseConfig, multipart/form-data', () => {
  const formData = new FormData()
  formData.append('name', 'alex')
  const { url, requestInit } = createRequestInit({
    action: 'http://localhost:3000/api/users',
    method: 'post',
    encType: 'multipart/form-data',
    formData,
    baseConfig: emptyBaseConfig,
  })

  expect(url).toEqual('http://localhost:3000/api/users')
  expect(requestInit.method).toEqual('post')
  expect((requestInit.headers as any)['Content-Type']).toEqual(undefined)
  expect(requestInit.body).toBeInstanceOf(FormData)
  expect((requestInit.body as FormData).get('name')).toBe('alex')
})

test('createRequestInit with baseConfig GET', () => {
  baseConfig.method = 'get'
  const formData = new FormData()
  formData.append('name', 'alex')
  const { url, requestInit } = createRequestInit({
    action: '/users?',
    formData,
    baseConfig: baseConfig,
  })

  expect(requestInit.method).toEqual('get')
  expect(url).toEqual('http://localhost:4000/api/users?name=alex')
  expect((requestInit.headers as any)['Content-Type']).toEqual(
    'application/x-www-form-urlencoded;charset=UTF-8',
  )
})

test('createRequestInit with baseConfig, useBaseConfig = `false`', () => {
  const formData = new FormData()
  formData.append('name', 'alex')
  const { url, requestInit } = createRequestInit({
    action: 'http://localhost:3000/api/users?',
    method: 'get',
    formData,
    baseConfig: baseConfig,
    useBaseConfig: false,
  })

  expect(requestInit.method).toEqual('get')
  expect(url).toEqual('http://localhost:3000/api/users?name=alex')
  expect((requestInit.headers as any)['Content-Type']).toEqual(
    'application/x-www-form-urlencoded;charset=UTF-8',
  )
})
