import { useNavigate } from 'react-router-dom';
import { signOut, User } from 'firebase/auth';
import { auth } from './authentication/firebase';
import { Link } from 'react-router-dom';


const Landing = ({ authUser }: { authUser: User | null }) => {
  const navigate = useNavigate();

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('Signed out successfully.');
        navigate('/signin');
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <>
      <main className="main-content">
        <div className="card">
          {authUser ? (
            <div className="text-center">
              <p>Welcome! <span className="user-name">{authUser.displayName}</span></p>
              <p>Signed in as <span className="user-email">{authUser.email}</span></p>
              <button
                onClick={userSignOut}
                className="signout-button"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <p>Landing Page! Not signed in.</p>
          )}
        </div>
        <Link to='/scan' className="start-scanning-link">Start Scanning</Link>
      </main>
    </>
  );
};

export default Landing;
