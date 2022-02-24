import * as React from 'react'
import { Config } from '../types'

const ConfigContext = React.createContext<Config>({
  baseUrl: undefined,
  method: undefined,
  encType: undefined,
})

/**
 * @deprecated
 */
export const ConfigProvider: React.FC<Config> = ({ children, ...config }) => {
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  )
}

/** @deprecated */
export function useConfig() {
  return React.useContext(ConfigContext)
}
