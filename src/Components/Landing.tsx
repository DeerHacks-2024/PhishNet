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
      <div className="bg-gray-100"></div>
      <main className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10 mb-52">
          {authUser ? (
            <div className="text-center">
              <p className="text-gray-800 font-semibold text-xl mb-2">Welcome! {authUser.displayName}</p>
              <p className="text-gray-600">Signed in as <span className="text-blue-500">{authUser.email}</span> <span className="text-blue-500">{authUser.displayName}</span>.</p>
              <button
                onClick={userSignOut}
                className="mt-6 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <p className="text-gray-700 text-center">Landing Page! Not signed in.</p>
          )}
        </div>
        <Link to='/scan'>Start Scanning</Link>
      </main>
    </>
  );
};

export default Landing;
