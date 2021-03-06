import * as React from 'react'

import { useFetch, UseFetchParams } from './useFetch'
import { FormProps, UseForm } from '../types'

/**
 * hook to bind to the `form` element
 *
 * `eg.`
 *
 * ```tsx
 * const loginForm = useForm({...config})
 * return (
 *   <form {...loginForm.getFormProps()}>
 *     <input name="email" type="email" />
 *     <input name="password" type="password" />
 *     <button type="submit">Submit</button>
 *   </form>
 * )
 * ```
 */
export function useForm<DataType, ErrorType>(
  config: Omit<FormProps<DataType, ErrorType>, 'children'>,
): UseForm<DataType, ErrorType> {
  /** initialize formRef */
  const form = React.useRef<HTMLFormElement | null>(null)

  /** initialize formData */
  const formData = React.useRef<FormData>(
    new FormData(form.current || undefined),
  )

  /** memoized config */
  const useFetchConfig = React.useMemo<UseFetchParams<DataType, ErrorType>>(
    () => ({
      useBaseConfig: config.useBaseConfig || true,
      action: config.action || '',
      method: config.method || 'post',
      formData: formData.current || undefined,
      encType: config.encType || 'application/x-www-form-urlencoded',
      query: config.query || '',
      hook: config.hook || undefined,
      headers: config.headers || undefined,
      transform: config.transform || undefined,
    }),
    [config],
  )

  const {
    request,
    submit,
    setSubmit,
    abort,
    setAbort,
    data,
    error,
    status,
    transition,
    abortRequest,
  } = useFetch<DataType, ErrorType>(useFetchConfig)

  /** submit handler */
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
      config.includeSubmitValue &&
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

  const getFormProps = () => ({
    ref: form as any,
    action: request.formUrl as string,
    method: request.method as string,
    encType: request.encType as string,
    onSubmit: submitHandler,
  })

  return {
    ref: form,
    data,
    error,
    status,
    transition,
    onSubmit: submitHandler,
    abort: abortRequest,
    getFormProps,
  }
}
