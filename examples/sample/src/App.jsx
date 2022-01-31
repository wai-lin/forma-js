import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import { Basic } from './routes/basic'
import { GlobalConfig } from './routes/global-config'
import { Graphql } from './routes/graphql'
import { HookForm } from './routes/hook'

function App() {
  return (
    <>
      <BrowserRouter>
        <header>
          <h3>Examples</h3>
          <nav>
            <Link to="/">Basic</Link>
            <Link to="graphql">Graphql</Link>
            <Link to="global-config">Global Config</Link>
            <Link to="hook-form">Hook Form</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Basic />} />
            <Route path="/graphql" element={<Graphql />} />
            <Route path="/global-config" element={<GlobalConfig />} />
            <Route path="/hook-form" element={<HookForm />} />
          </Routes>
        </main>
      </BrowserRouter>
    </>
  )
}

export default App
