// import logo from './logo.svg';
// import './App.css';
import Navbar from './components/Navbar'
import Manager from './components/Manager'
import Footer from './components/Footer'
function App() {
  return (
   <>
     <div className="absolute top-0 z-[-2]  w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        <Navbar />
        <div className='min-h-[85vh]'> <Manager /></div>
        <Footer />
      </div>
   </>
  );
}

export default App;
