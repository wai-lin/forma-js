# Forma-JS (Remix.run's Form component inspired library)

[Remix.run](remix.run) has a super cool `Form` component which almost eliminate the usage of states. And also gracefully cancel the simultaneous form requests. This library is inspired by the remix.run's `Form` component with a bit more features that might be necessary in non remix projects.

---

# Announcement!

In Mar 23rd, 2022(I'm from South-east Asia so timeline might be a bit different for you ⏱), `remix` announced that next `react-router` release will also be included with `remix's` route based data fetching, Form, useFetcher and other cool features. Therefore, this library will be archived after a few weeks of `react-router` releasing with these cool features. Since this library's purpose is to kind of mimic `remix`'s `Form` component and `useFetcher` hook, it will not be necessary anymore when `react-router` releases with these features. Hope you have a smooth transition to `remix` or `react-router` in new release.

---

### Disclaimer

This library is not a replacement of the remix.run's `Form` component. It is to help your old projects migrate to remix.run by familiarizing you team members with the remix's similar `Form` component.

This library also does not mimic the remix.run's Form component which is bind with route transitions and so on. This library is more similar to remix.run's `useFetcher` since this uses `fetch` request and provide component level states.

---

### Fallback Support

If you want your browser to fallback the `fetch` request, you need to avoid using `encType="application/json"` and `method="graphql"` in your form. These two features are fancy add-on features that are not supported by the browser without enabling JavaScript.

> **IN SUMMARY:** If you need to support the use-case of users disabling JavaScript on their browsers,
> you need to avoid using `encType="application/json"` and `method="graphql"` in your form.
> Since these two features only work when JavaScript is enabled.

---

### Breaking Changes

- `ConfigProvider` component is deprecated starting from v1.3.0
  - After asking for an opinion about this library from Kent C. Dodds on his [live-stream](https://youtu.be/BhQHIh9NvSQ?t=1356), my opinion align with his explanation. Instead of using `ConfigProvider`, we should use constant variables like `.env` or `config.js` to store the configuration. And then use it as action baseUrl should be more declarative.

---

### Installation

```bash
npm i @forma-js/react

# OR

yarn add @forma-js/react
```

---

### Usage

#### Basic Form

```tsx
import { Form } from '@forma-js/react'

/**
 * in your project you should store this url in `.env` file
 * or separate `config.js` file and import it
 */
const baseUrl = 'https://mysecurebackend.com/api'

function LoginForm() {
  return (
    <Form method="post" action={`${baseUrl}/login`}>
      {() => (
        <div>
          <input name="email" type="email" />
          <input name="password" type="password" />
          <button type="submit">Login</button>
        </div>
      )}
    </Form>
  )
}
```

---

#### ~~Global Config Provider~~ (deprecated)

`App.tsx`

```tsx
import { ConfigProvider } from '@forma-js/react'
import { CreateUserForm } from './CreateUserForm'

export function App() {
  return (
    <ConfigProvider
      baseUrl="http://localhost:4000/api"
      method="post"
      encType="application/json"
    >
      <CreateUserForm />
    </ConfigProvider>
  )
}
```

`CreateUserForm.tsx`

```tsx
import { Form } from '@forma-js/react'

export function CreateUserForm() {
  return (
    <Form action="/users">
      {() => (
        <div>
          <input name="name" type="text" />
          <input name="email" type="email" />
          <button type="submit">Create New User</button>
        </div>
      )}
    </Form>
  )
}
```

---

#### Pending State

```tsx
import { Form } from '@forma-js/react'

function CreateUserForm() {
  return (
    <Form action="/users">
      {({ transition }) => (
        <div>
          <input name="name" type="text" />
          <input name="email" type="email" />
          <button
            type="submit"
            aria-disabled={transition.state === 'submitting'}
          >
            {transition.state === 'submitting'
              ? 'Creating ...'
              : 'Create New User'}
          </button>
        </div>
      )}
    </Form>
  )
}
```

---

#### Cancelable Form

```tsx
import { Form } from '@forma-js/react'

function CreateUserForm() {
  return (
    <Form action="/users">
      {({ abort, transition }) => (
        <div>
          <input name="name" type="text" />
          <input name="email" type="email" />
          {transition.state === 'submitting' && (
            <button type="button" onClick={abort}>
              Cancel
            </button>
          )}
          <button type="submit">Create New User</button>
        </div>
      )}
    </Form>
  )
}
```

---

#### Form with Error

```tsx
import { Form } from '@forma-js/react'

function CreateUserForm() {
  return (
    <Form action="/users">
      {({ error }) => (
        <div>
          {error?.message && <div>{error.message}</div>}
          <input name="name" type="text" />
          <input name="email" type="email" />
          <button type="submit">Create New User</button>
        </div>
      )}
    </Form>
  )
}
```

---

#### Form with Success

```tsx
import { Form } from '@forma-js/react'

function CreateUserForm() {
  return (
    <Form action="/users">
      {({ status, data }) => (
        <div>
          {status === 200 && <div>{data.message}</div>}
          <input name="name" type="text" />
          <input name="email" type="email" />
          <button type="submit">Create New User</button>
        </div>
      )}
    </Form>
  )
}
```

---

#### Hook Form

```tsx
import { useForm } from '@forma-js/react'

const baseUrl = 'https://mysecurebackend.com/api'

function CreateUserForm() {
  /**
   * transform and headers need to Memoize in hook form.
   * otherwise, it will trigger re-render infinitely.
   * if you don't want to memoize them, you can declare them outside of the react component.
   */
  const transform = React.useCallback(
    (data) => ({ ...data, age: Number(data.age) }),
    [],
  )
  const headers = React.useMemo(() => ({ authorization: 'Bearer 123' }), [])

  const createUserForm = useForm({
    action: `${baseUrl}/users`,
    method: 'post',
    encType: 'application/json',
    transform,
    headers,
  })

  return (
    <form {...createUserForm.getFormProps()}>
      <input name="name" type="text" />
      <input name="email" type="email" />
      <input name="age" type="number" />
      <button
        type="submit"
        aria-disabled={createUserForm.transition.state === 'submitting'}
      >
        Create New User
      </button>
    </form>
  )
}
```

---

#### GraphQL Form

```tsx
import { Form } from '@forma-js/react'

const baseUrl = 'https://mysecurebackend.com/api'

function CreateUserForm() {
  return (
    <Form
      method="graphql"
      action={`${baseUrl}/users`}
      query={`
        mutation CreateUser($name: String!, $email: String!) {
          createUser(name: $name, email: $email) {
            id
            name
            email
          }
        }
      `}
    >
      {() => (
        <div>
          <input name="name" type="text" />
          <input name="email" type="email" />
          <button type="submit">Create New User</button>
        </div>
      )}
    </Form>
  )
}
```

---

#### Get Form Data

```tsx
import { Form } from '@forma-js/react'

function CreateUserForm() {
  return (
    <Form action="/users">
      {({ transition }) => (
        <div>
          <input name="name" type="text" />
          <input name="email" type="email" />

          <button
            name="_action"
            value="update"
            type="submit"
            aria-disabled={transition.state === 'submitting'}
          >
            {transition.state === 'submitting' &&
            transition.formData.get('_action') === 'update'
              ? 'Updating ...'
              : 'Update User'}
          </button>

          <button
            name="_action"
            value="create"
            type="submit"
            aria-disabled={transition.state === 'submitting'}
          >
            {transition.state === 'submitting' &&
            transition.formData.get('_action') === 'create'
              ? 'Creating ...'
              : 'Create New User'}
          </button>
        </div>
      )}
    </Form>
  )
}
```

---

#### Post Form Data with Transform (`graphql` and `application/json` only)

```tsx
import { Form } from '@forma-js/react'

function CreateUserForm() {
  return (
    <Form
      action="/users"
      encType="application/json"
      transform={(data) => ({ ...data, age: Number(data.age) })}
    >
      {() => (
        <div>
          <input name="name" type="text" />
          <input name="age" type="number" />
          <button type="submit">Submit</button>
        </div>
      )}
    </Form>
  )
}
```

---

#### Life Cycle

```tsx
import { Form } from '@forma-js/react'

function CreateUserForm() {
  return (
    <Form
      action="/users"
      hook={{
        beforeRequest(init) {
          console.log('beforeRequest', init)
        },
        afterRequest() {
          console.log('afterRequest')
        },
        onSuccess(response) {
          console.log('onSuccess', response)
        },
        onError(error) {
          console.log('onError', error)
        },
        onAbort() {
          console.log('onAbort')
        },
        onCatchError(e) {
          console.log('onCatchError', e)
        },
      }}
    >
      {({ transition }) => (
        <div>
          <input name="name" type="text" />
          <input name="email" type="email" />
          <button
            type="submit"
            aria-disabled={transition.state === 'submitting'}
          >
            Create New User
          </button>
        </div>
      )}
    </Form>
  )
}
```

---

### API

```tsx
function Form<DataType, ErrorType>({
  method,
  action,
  encType,
  query,
  hook,
  body,
  includeSubmitValue,
  children,
}: FormProps<DataType, ErrorType> &
  Omit<
    React.FormHTMLAttributes<HTMLFormElement>,
    'method' | 'encType' | 'action'
  >): JSX.Element

function useForm<DataType, ErrorType>(
  config: FormProps<DataType, ErrorType>,
): UseFormReturnType<DataType, ErrorType>

/** @deprecated */
const ConfigProvider: React.FC<Config>
```

#### Types

```tsx
type Method = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'graphql'

type EncType =
  | 'multipart/form-data'
  | 'application/json'
  | 'application/x-www-form-urlencoded'

type TransitionState = 'idle' | 'submitting' | 'error' | 'catch-error'

interface Transition {
  state: TransitionState
  formData: FormData
}

type ResponseParam<DataType> = Response & { data: DataType }

type LifeCycleFuncs<DataType, ErrorType> = {
  /**
   * Called right before making fetch request, after generating request init.
   * RequestInit object is passed as argument so that it can be modified before
   * making the request. All the options except `signal` is mutable for the RequestInit.
   */
  beforeRequest?: (init: Omit<RequestInit, 'signal'>) => void
  /**
   * Called after fetch request whether it's `failed` or `success`.
   * Cannot access to any object.
   */
  afterRequest?: () => void
  /**
   * Called when `response.ok` is `true`.
   * Response object is passed as argument.
   */
  onSuccess?: (res: ResponseParam<DataType>) => void
  /**
   * Called when `response.ok` is `false`.
   * Response object is passed as argument.
   */
  onError?: (res: ResponseParam<ErrorType>) => void
  /**
   * Called on catch handler.
   * Error object is passed as argument.
   */
  onCatchError?: (e: any) => void
  /**
   * Called after fetch request is aborted.
   * Cannot access to any object.
   */
  afterAbort?: () => void
}

type ChildrenProps<DataType, ErrorType> = {
  data: DataType | null
  error: ErrorType | null
  status: number
  transition: Transition
  abort: () => void
}

type FormProps<DataType, ErrorType> = {
  useBaseConfig?: boolean
  action: string
  method: Method
  encType?: EncType
  query?: string
  body?: any
  hook?: LifeCycleFuncs<DataType, ErrorType>
  includeSubmitValue?: boolean
  transform?: (data: { [key: string]: any }) => any
  children: (props: ChildrenProps<DataType, ErrorType>) => React.ReactNode
}

type UseFormReturnType<DataType, ErrorType> = ChildrenProps<
  DataType,
  ErrorType
> & {
  ref: React.MutableRefObject<HTMLFormElement | null>
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}
```
