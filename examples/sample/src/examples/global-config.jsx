import * as React from 'react'
import { JsonPretty, FormControl, Button } from '../components'
import { Form, ConfigProvider } from '@platform-form/react'

export function ChildForm() {
  return (
    <Form action="/users">
      {({ data, error, status, transition }) => (
        <>
          <JsonPretty json={{ state: transition.state, status, data, error }} />

          <div>
            <FormControl>
              <label htmlFor="email">Your Email</label>
              <input id="email" name="email" type="email" />
            </FormControl>

            <FormControl>
              <label htmlFor="name">Your Name</label>
              <input id="name" name="password" />
            </FormControl>

            <Button type="submit">Create</Button>
          </div>
        </>
      )}
    </Form>
  )
}

export const GlobalConfig = () => {
  return (
    <ConfigProvider
      baseUrl="http://localhost:4000/api"
      method="get"
      encType="application/x-www-form-urlencoded"
    >
      <h4>Global Config Form</h4>

      <ChildForm />
    </ConfigProvider>
  )
}
