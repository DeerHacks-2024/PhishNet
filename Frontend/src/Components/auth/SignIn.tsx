import  { useState, FormEvent } from 'react';
import { auth } from '../authentication/firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Link } from 'react-router-dom';

const SignIn = () => {

  const navigate = useNavigate(); // Initialize navigate function

    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signIn = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      signInWithEmailAndPassword(auth, email , password).then((userCredentials) => {
        console.log(userCredentials)
        navigate('/landing');
      })
      .catch((Error) => {
        if (Error.code == 'auth/user-disabled'){
          console.log('The user account has been disabled.');
          const elements = document.getElementsByClassName('disable');
          if (elements.length > 0) {
            const h1Element = elements[0] as HTMLHeadingElement; // Cast to specific element type
            h1Element.textContent = 'The account has been disabled. Check your email.';
          }
        } else{
        console.log(Error);
        }
      })
    }
  return (
    <>
      <div className="container">
        <div className="form-box">
          <form className="form" onSubmit={signIn}>
            <h1 className="form-heading">Log In</h1>
            <h2 className="disabled-text"></h2>
            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <input id="email" type="email" required className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <input id="password" type="password" required className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="submit-button">Log In</button>
          </form>
        </div>
        <Link to="/" className="link-text linking">Sign Up?</Link>
      </div>
    </>
  )
}

export default SignIn