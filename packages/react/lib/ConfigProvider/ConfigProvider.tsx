import * as React from 'react'
import { Config } from '../types'

const ConfigContext = React.createContext<Config>({
  baseUrl: undefined,
  method: undefined,
  encType: undefined,
})

export const ConfigProvider: React.FC<Config> = ({ children, ...config }) => {
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  )
}

export function useConfig() {
  return React.useContext(ConfigContext)
}
