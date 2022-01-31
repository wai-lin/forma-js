import * as React from 'react'

import { JsonPretty, Button, FormControl } from '../components'
import { Form } from '@forma-js/react'

export function Basic() {
  const [requestRoute, setRequestRoute] = React.useState('/random')

  return (
    <>
      <h4>Basic Form</h4>

      <div>
        <p>Select route to fetch</p>
        <select
          value={requestRoute}
          onChange={(e) => setRequestRoute(e.currentTarget.value)}
        >
          <option value="/random">/random</option>
          <option value="/throttle">/throttle</option>
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

      <Form method="post" action={`http://localhost:4000${requestRoute}`}>
        {({ data, error, status, transition }) => (
          <>
            <JsonPretty
              json={{ state: transition.state, status, data, error }}
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
          </>
        )}
      </Form>
    </>
  )
}
