import axiosClient from '../api/axiosClient';
import BaseLayout from '../layouts/BaseLayout';

const Landing = ({ currentUser }) => {
  return (
    <BaseLayout currentUser={currentUser}>
      {currentUser ? (<h1>You are signed in!</h1>) : (<h1>You are not signed in!</h1>)}
    </BaseLayout>
  )
}

export async function getServerSideProps(context) {
  const client = axiosClient(context);
  const response = await client.get('/api/users/currentuser', {
    withCredentials: true,
  });

  return {
    props: response.data
  }
}

export default Landing