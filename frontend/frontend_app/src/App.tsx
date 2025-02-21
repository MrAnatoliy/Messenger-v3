import { Route, Routes } from "react-router-dom"
import Welcome from "./pages/Welcome"


export default function Page() {
  return (
    <Routes>
      <Route path="/" element={<Welcome/>}/>
    </Routes>
  )
}