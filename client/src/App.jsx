import React from 'react'
import { BrowserRouter , Routes , Route} from 'react-router-dom'
import Home from './pages/Home'
import GetCurrentUser from './hooks/GetCurrentUser.jsx'
export const serverUrl = "http://localhost:8000"
import Dashboard from './pages/Dashboard.jsx'
import Generate from './pages/Generate.jsx'
import { Navigate } from 'react-router-dom'

import { useSelector } from 'react-redux'
import WebsiteEditor from './pages/Editor.jsx'
import DeployedSite from './pages/DeployedSite.jsx'
import Pricing from './pages/Pricing.jsx'


function App() {
GetCurrentUser()
const {userData} = useSelector((state)=>state.user)
  

  return (
    <div>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
             <Route path="/dashboard" element={userData?<Dashboard/>:<Home/>}
              />
              <Route path="/generate" element={userData?<Generate/>:<Home/>}
              />
              <Route path="/editor/:id" element={userData?<   WebsiteEditor/>:<Home/>}
              />
              <Route path="/site/:slug" element={<DeployedSite />} />
              <Route path="/pricing" element={<Pricing />} />

        </Routes>
      </BrowserRouter>
      </div>
    
  )
}

export default App
