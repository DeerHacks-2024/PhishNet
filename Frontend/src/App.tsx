import './App.css';
import { lazy, Suspense, useState, useEffect } from 'react';
import { auth } from './Components/authentication/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { setPersistence, browserLocalPersistence, User } from "firebase/auth";
// Import MemoryRouter instead of BrowserRouter
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PopupComponent from './Components/PopupComponent';

const SignIn = lazy(() => import('./Components/auth/SignInPage'));
const SignUp = lazy(() => import('./Components/auth/SignUpPage'));
const RequireAuth = lazy(() => import('./Components/auth/RequiredAuth'));
const Landing = lazy(() => import('./Components/Landing'));
const ScanComponent = lazy(() => import ('./Components/ScanComponent'))

function App() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        return onAuthStateChanged(auth, user => {
          setAuthUser(user);
          setIsLoading(false);
        });
      })
      .catch((error) => {
        console.error("Error with persistence setting:", error);
        setIsLoading(false);
      });

    const unsubscribe = onAuthStateChanged(auth, user => {
      setAuthUser(user);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MemoryRouter>
        <Routes>
          <Route path="/landing" element={
            <RequireAuth authUser={authUser}>
              <Landing authUser={authUser} />
            </RequireAuth>
          }/>

          <Route path="/login" element={<SignIn />} />

          <Route path="/scan" element={<ScanComponent />} />
          <Route path="/autoscan" element={<PopupComponent />} />
          
          <Route path="/" element={<SignUp />} />
        </Routes>
      </MemoryRouter>
    </Suspense>
  );  
}

export default App;
