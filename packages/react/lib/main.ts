import {
  EncType,
  LifeCycleFuncs,
  Method,
  ResponseParam,
  Transition,
  TransitionState,
  ChildrenProps,
  Config,
  FormProps,
  UseForm,
} from './types'

import { ConfigProvider } from './ConfigProvider/ConfigProvider'
import { Form } from './Form/Form'
import { useForm } from './Hook/useForm'

export { ConfigProvider, Form, useForm }

export type {
  EncType,
  LifeCycleFuncs,
  Method,
  ResponseParam,
  Transition,
  TransitionState,
  ChildrenProps,
  Config,
  FormProps,
  UseForm as UseFormReturnType,
}
