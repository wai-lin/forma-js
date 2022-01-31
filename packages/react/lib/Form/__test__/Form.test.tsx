/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react'

import { Form } from '../Form'

test('Form', () => {
  render(
    <Form method="get" action="/">
      {() => <input title="name" name="name" />}
    </Form>,
  )
})
