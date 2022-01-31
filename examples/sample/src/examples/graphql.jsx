import * as React from 'react'
import { JsonPretty, FormControl, Button } from '../components'
import { Form } from '@platform-form/react'

export function Graphql() {
  return (
    <>
      <h4>Graphql Form</h4>

      <Form
        method="graphql"
        action="http://localhost:4000/graphql"
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
        {({ data, error, status, transition }) => (
          <>
            <JsonPretty
              json={{ state: transition.state, status, data, error }}
            />

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
    </>
  )
}
