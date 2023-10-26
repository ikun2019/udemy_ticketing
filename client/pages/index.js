import axiosClient from '../api/axiosClient';

const index = ({ currentUser }) => {
  return currentUser ? <h1>You are signed in</h1> : <h1>You are not signed in</h1>
}

export async function getServerSideProps(context) {
  const client = axiosClient();
  const response = await client.get('/api/users/currentuser', {
    withCredentials: true,
    headers: context.req.headers,
  });

  return {
    props: response.data
  }
}

export default index