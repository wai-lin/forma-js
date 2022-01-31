import * as React from 'react'

import { JsonPretty, Button, FormControl } from '../components'
import { useForm } from '@platform-form/react'

export function HookForm() {
  const [requestRoute, setRequestRoute] = React.useState('/random?')

  const loginForm = useForm({
    action: `http://localhost:4000${requestRoute}`,
    method: 'get',
    encType: 'application/x-www-form-urlencoded',
  })
  const loginFormProps = { ref: loginForm.ref, onSubmit: loginForm.onSubmit }

  return (
    <>
      <h4>Hook Form</h4>

      <div>
        <p>Select route to fetch</p>
        <select
          value={requestRoute}
          onChange={(e) => setRequestRoute(e.currentTarget.value)}
        >
          <option value="/random?">/random</option>
          <option value="/throttle?">/throttle</option>
        </select>

        <ul>
          <li>
            <kbd>/random</kbd> route is for any request
          </li>
          <li>
            <kbd>/throttle</kbd> route will pending for 2 second
          </li>
        </ul>
      </div>

      <form {...loginFormProps}>
        <JsonPretty
          json={{
            state: loginForm.transition.state,
            status: loginForm.status,
            data: loginForm.data,
            error: loginForm.error,
          }}
        />

        <div>
          <FormControl>
            <label htmlFor="statusCode">Response Status Code</label>
            <input id="statusCode" name="statusCode" type="number" />
          </FormControl>

          <FormControl>
            <label htmlFor="email">Your Email</label>
            <input id="email" name="email" type="email" />
          </FormControl>

          <FormControl>
            <label htmlFor="password">Your Secure Password</label>
            <input id="password" name="password" type="password" />
          </FormControl>

          <Button type="submit">Create</Button>
        </div>
      </form>
    </>
  )
}
