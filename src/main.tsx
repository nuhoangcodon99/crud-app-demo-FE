import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/UserContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <UserProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  </UserProvider>
)
