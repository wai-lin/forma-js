import type { FormProps } from '../types'

import * as React from 'react'
import { useFetch } from '../Hook/useFetch'

/**
 * The request headers and body will be generated base on the `encType` and `reqBody`.
 * `formData` will be serialized to appropriate `body` type based on `encType` value.
 *
 * When `reqBody` is not empty, the `Content-Type` header will be set to `application/json` by force
 * and `reqBody` will be used as the `body`. So the `reqBody` needs to be a valid JSON string.
 */
export function Form<DataType, ErrorType>({
  useBaseConfig,
  method = 'post',
  action = '/',
  encType = 'multipart/form-data',
  query = '',
  hook,
  body,
  includeSubmitValue = true,
  children,
  ...props
}: FormProps<DataType, ErrorType> &
  Omit<
    React.FormHTMLAttributes<HTMLFormElement>,
    'method' | 'encType' | 'action'
  >) {
  /** initialize form ref */
  const form = React.useRef<HTMLFormElement | null>(null)

  /** initialize formData */
  const formData = React.useRef<FormData>(
    new FormData(form.current || undefined),
  )

  const {
    submit,
    setSubmit,
    abort,
    setAbort,
    data,
    error,
    status,
    transition,
    abortRequest,
  } = useFetch<DataType, ErrorType>({
    useBaseConfig,
    action,
    method,
    formData: formData.current,
    encType,
    query,
    hook,
    body,
  })

  /** onSubmit handler */
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    /**
     * 1. get submit button value
     * 2. update formData value
     * 3. remove previous formData submitter value
     * 4. update formData submitter value if it's exists
     */
    const submitter = (e.nativeEvent as any).submitter as HTMLButtonElement
    formData.current = new FormData(e.currentTarget)
    if (
      includeSubmitValue &&
      submitter.hasAttribute('name') &&
      submitter.hasAttribute('value')
    ) {
      formData.current.delete(submitter.name)
      formData.current.append(submitter.name, submitter.value)
    }

    /**
     * When submit state is `false`,
     * 1. Set submit state to `true` to trigger fetch request
     * 2. Set abort state to `false`, if abort state is already `true`.
     *    So that the fetch request can re-fetch again on next click.
     */
    if (!submit) {
      setSubmit(true)
      abort && setAbort(false)
    }

    /**
     * When submit state is `true`,
     * 1. Set abort state to `false` to cancel current fetch request
     * 2. Set submit state to `false`, so that fetch request can be trigger again on next click.
     */
    if (submit) {
      setAbort(true)
      setSubmit(false)
    }
  }

  return (
    <form
      ref={form}
      method={method}
      action={action}
      encType={encType}
      onSubmit={submitHandler}
      {...props}
    >
      {children({ data, error, status, transition, abort: abortRequest })}
    </form>
  )
}
