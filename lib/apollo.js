import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import fetch from 'isomorphic-unfetch';
import jwt from 'jsonwebtoken';
import { useAuth } from '../components/AuthProvider';

const initApolloClient = (initialState = {}, token, userId, refreshToken, setAuthToken) => {
  const cache = new InMemoryCache().restore(initialState);
  
  const httpLink = createHttpLink({
    uri: `${process.env.BASE_URL}/graphql/query`,
    fetch,
    // credentials: 'include',
    // fetchOptions: {
    //   mode: 'cors',
    // },
  });

  const authLink = setContext((_, { headers }) =>
    // return the headers to the context so httpLink can read them
    ({
      headers: {
        ...headers,
        //authorization: token !== undefined && token !== null ? `Bearer ${token}` : '',
      },
    })
  );

  const client = new ApolloClient({
    ssrMode: false,
    link: authLink.concat(httpLink),
    cache,
  });
  return client;
};

const withApollo = (PageComponent) => {
  const WithApollo = ({ apolloClient, apolloState, ...pageProps }) => {
    const { authState, setAuthToken } = useAuth();

    const client =
      apolloClient ||
      initApolloClient(
        apolloState,
        authState.token,
        setAuthToken
      );

    return (
      <ApolloProvider client={client}>
        <PageComponent {...pageProps} />
      </ApolloProvider>
    );
  };

  return WithApollo;
};

export default withApollo;
