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
      <main className="w-full bg-gray-100 flex flex-col justify-center items-center">
        <div className="p-6 w-72 bg-white rounded-lg shadow-lg mt-10 mb-20">
          
          {authUser ? (
            <div className='flex flex-col'>
              <div className='flex flex-row justify-between'>
              {/*<img className="w-6 h-6 rounded-md mt-auto mb-auto" src="./src/images/icon/user.png"/>*/}
              <span className="mt-auto mb-auto text-lg font-mono text-blue-500 flex flex-row"><img className="w-6 h-6 rounded-md mt-auto mb-auto mr-1" src="./src/images/icon/user.png"/>{authUser.displayName}</span>
              <button
                onClick={userSignOut}
                className="right px-6 py-3 bg-blue-500 text-white text-right rounded hover:bg-blue-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Sign Out
              </button>
              </div>
              
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
