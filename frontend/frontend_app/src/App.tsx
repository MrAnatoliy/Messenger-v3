import { Route, Routes } from "react-router-dom"
import Welcome from "./pages/Welcome"
import Home from "./pages/Home"
import PrivateRoute from "./components/privateRoutes"


export default function Page() {
  return (
    <Routes>
      <Route path="/" element={<Welcome/>} /> 
      <Route path="/home" element={
        <PrivateRoute>
          <Home/>
        </PrivateRoute>
        }/>
      <Route path="*" element={<Welcome/>}/>
    </Routes>
  )
}