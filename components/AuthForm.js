import { useApolloClient, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useState } from 'react';
import { useAuth } from './AuthProvider';

const SIGN_IN_MUTATION = gql`
mutation login($username: String!, $password:String!){
  auth {
    login(email:$username, password:$password)
  }
} 
`;

const REGISTER_MUTATION = gql`
mutation register($user:InputUser!){
  auth{
    register(input:$user)
  }
}
`;

const AuthForm = ({ authFormPurpose, setAuthFormPurpose }) => {
  const { signIn } = useAuth();
  const [tokenAuth] = useMutation(SIGN_IN_MUTATION);
  const [createUser] = useMutation(REGISTER_MUTATION);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const client = useApolloClient();

  const handleSignIn = async (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;

    try {
      await client.resetStore();
      const { data } = await tokenAuth({
        variables: {
          username: email.value,
          password: password.value,
        },
      });
      console.log(data);
      if (data?.auth?.login) {
        const { token} = data.auth.login.token;
        signIn(token);
      }
      setAuthFormPurpose(undefined);
    } catch (error) {
      setError("Please enter valid username and password")
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    const { firstname, lastname, email, password } = event.target.elements;

    try {
      await client.resetStore();
      const { data } = await createUser({
        variables: {
          user: {
            firstname: firstname.value,
            lastname: lastname.value,
            email: email.value,
            password: password.value,
          }
        },
      });
      if (data?.auth?.register) {
        const { token } = data.auth.register.token;
        signIn(token);
        setMessage(message);
      }
      setAuthFormPurpose(undefined);
    } catch (error) {
      setError("Register failed")
    }
  };

  let handleSubmit;
  if (authFormPurpose === 'signIn') handleSubmit = handleSignIn;
  if (authFormPurpose === 'register') handleSubmit = handleRegister;

  return (
    <div
      className="absolute w-full h-full flex flex-col justify-center items-center z-10"
      style={{
        backgroundColor: 'rgba(255,255,255,.95)',
      }}
    >
      <div className="bg-gray-100 w-96 py-8 shadow-lg rounded-lg px-10">
        <form onSubmit={handleSubmit}>

          {authFormPurpose === 'register' &&
          <div>
            {message ? (
              <div className="mt-6">
                <p className="text-sm text-blue-500 -bottom-6">{message}</p>
                <br/>
              </div>
              ): <></>}
            <label
              htmlFor="firstname"
              className="block text-sm font-medium leading-5 text-gray-700"
            >
              Firstname
              <div className="mt-1 rounded-md shadow-sm">
                <input
                  id="firstname"
                  type="firstname"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </label>
            <label
              htmlFor="lastname"
              className="block text-sm font-medium leading-5 text-gray-700"
            >
              Lastname
              <div className="mt-1 rounded-md shadow-sm">
                <input
                  id="lastname"
                  type="lastname"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </label>            
          </div>
          
          }

          <div className="mt-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-5 text-gray-700"
            >
              Email address
              <div className="mt-1 rounded-md shadow-sm">
                <input
                  id="email"
                  type="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </label>
          </div>

          <div className="mt-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-5 text-gray-700"
            >
              Password
              <div className="mt-1 rounded-md shadow-sm">
                <input
                  id="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </label>
          </div>
          {error ? (
          <div className="mt-6">
            <p className="text-sm text-red-500 -bottom-6">{error}</p>
          </div>
          ): <></>}
          <div className="mt-10">
            <span className="block w-full rounded-md shadow-sm">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
              >
                {authFormPurpose === 'signIn' && 'Sign In'}
                {authFormPurpose === 'register' && 'Register'}
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
