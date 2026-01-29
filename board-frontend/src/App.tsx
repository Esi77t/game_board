import './App.css'
import Header from './components/Header/Header'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Signup from './pages/Signup/Signup'
import Login from './components/Login/Login'
import BoardWrite from './pages/BoardWrite/BoardWrite'
import BoardDetail from './pages/BoardDetail/BoardDetail'

function App() {
    return (
        <div className='App'>
            <Header />
            <main className='main-container'>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path="/boards/write" element={<BoardWrite />} />
                    <Route path="/boards/:id" element={<BoardDetail />}/>
                </Routes>
            </main>
        </div>
    );
};

export default App
