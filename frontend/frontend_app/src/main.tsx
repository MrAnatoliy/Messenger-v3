import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { system } from './theme.ts'
import { Toaster } from './components/ui/toaster.tsx'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <BrowserRouter>
        <Toaster/>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>,
)
