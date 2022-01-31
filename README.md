# Forma-JS (Remix.run's Form component inspired library)

[Remix.run](remix.run) has a super cool `Form` component which almost eliminate the usage of states. And also gracefully cancel the simultaneous form requests. This library is inspired by the remix.run's `Form` component with a bit more features that might be necessary in non remix projects.

---

### Installation

```bash
npm i @forma-js/react

# OR

yarn add @forma-js/react
```

---

### How to run examples

1. clone this repo
2. run `npm install` (note: npm version `>= v7`)
3. run both `npm run examples:start` and `npm run examples:serve` in separate tabs
4. go to `localhost:3000`

---

### Usage

##### Basic Form

```tsx
import { Form } from '@forma-js/react'

function LoginForm() {
  return (
    <Form
      method="post"
      action="http://localhost:4000/api/login"
      encType="application/x-www-form-urlencoded"
    >
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

##### Global Config Provider

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

function CreateUserForm() {
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

##### Pending State

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

##### Cancelable Form

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

##### Form with Error

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

##### Form with Success

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

##### Hook Form

```tsx
import { useForm } from '@forma-js/react'

function CreateUserForm() {
  const createUserForm = useForm({
    action: '/users',
    method: 'post',
    encType: 'application/json',
  })
  const createUserFormProps = {
    ref: createUserForm.ref,
    onSubmit: createUserForm.onSubmit,
  }

  return (
    <form {...createUserFormProps}>
      {() => (
        <div>
          <input name="name" type="text" />
          <input name="email" type="email" />
          <button
            type="submit"
            aria-disabled={createUserForm.transition.state === 'submitting'}
          >
            Create New User
          </button>
        </div>
      )}
    </form>
  )
}
```

##### GraphQL Form

```tsx
import { Form } from '@forma-js/react'

function CreateUserForm() {
  return (
    <Form
      method="graphql"
      action="/users"
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

##### Get Form Data

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

##### Life Cycle

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

const ConfigProvider: React.FC<Config>
```

##### Types

```tsx
type Method = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'graphql'

type EncType =
  | 'multipart/form-data'
  | 'application/json'
  | 'application/x-www-form-urlencoded'

interface Config {
  baseUrl?: string
  method?: Method
  encType?: EncType
}

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
  action: string
  method: Method
  encType?: EncType
  query?: string
  body?: any
  hook?: LifeCycleFuncs<DataType, ErrorType>
  includeSubmitValue?: boolean
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
