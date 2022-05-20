import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { useState } from 'react';
import AuthForm from './AuthForm';
import { useAuth } from './AuthProvider';

const SIGN_OUT_MUTATION = gql`
  mutation logoutUser($userId: ID!) {
    logoutUser(userId: $userId){
      userId
    }
  }
`;

const Layout = ({ children, title }) => {
  const { authState, signOut } = useAuth();

  const [authFormPurpose, setAuthFormPurpose] = useState();

  const [signOutMutation] = useMutation(SIGN_OUT_MUTATION);

  const handleSignOut = async () => {
    await signOutMutation({
      variables: {
        userId: authState.userId,
      },
    });
    signOut();
  };

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {authFormPurpose && (
        <AuthForm
          authFormPurpose={authFormPurpose}
          setAuthFormPurpose={setAuthFormPurpose}
        />
      )}
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <div className="text-lg font-semibold">My Application Title</div>
                </div>
                {/* Navbar begins */}
                {authState.userId ? (
                <div className="max-w-7xl mx-auto px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className=" flex items-center">
                            <a className="flex-shrink-0" href="/">
                                <img className="h-8 w-8" src="https://www.tailwind-kit.com/icons/rocket.svg" alt="Workflow"/>
                            </a>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    <a className="text-gray-800  hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium" href="/#">
                                        Home
                                    </a>
                                    <a className="text-gray-300 dark:text-white  hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium" href="/#">
                                        Gallery
                                    </a>
                                    <a className="text-gray-300  hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium" href="/#">
                                        Content
                                    </a>
                                    <a className="text-gray-300  hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium" href="/#">
                                        Contact
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="block">
                            <div className="ml-4 flex items-center md:ml-6">
                            </div>
                        </div>
                        <div className="-mr-2 flex md:hidden">
                            <button className="text-gray-800 dark:text-white hover:text-gray-300 inline-flex items-center justify-center p-2 rounded-md focus:outline-none">
                                <svg width="20" height="20" fill="currentColor" className="h-8 w-8" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1664 1344v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45z">
                                    </path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                ) : (<></>)} 
                {/* Navbar Ends */}
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <a className="text-gray-300 hover:text-gray-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium" href="/#">
                            Home 1
                        </a>
                        <a className="text-gray-800 dark:text-white block px-3 py-2 rounded-md text-base font-medium" href="/#">
                            Gallery 1
                        </a>
                        <a className="text-gray-300 hover:text-gray-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium" href="/#">
                            Content 1
                        </a>
                        <a className="text-gray-300 hover:text-gray-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium" href="/#">
                            Contact 1
                        </a>
                    </div>
                </div>
              </div>
              <div className="flex">
                <button
                  type="button"
                  onClick={
                    authState.userId
                      ? handleSignOut
                      : () => setAuthFormPurpose('signIn')
                  }
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3" />
                  {authState.userId ? 'Sign Out' : 'Sign In'}
                </button>
                {!authState.userId &&
                <button
                  type="button"
                  onClick={() => setAuthFormPurpose('register')}
                  className="ml-4 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3" />
                  Register
                </button>}
              </div>
            </div>
          </div>
        </nav>
        <main>
          {children}
        </main>
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.element,
  title: PropTypes.string,
};

export default Layout;
