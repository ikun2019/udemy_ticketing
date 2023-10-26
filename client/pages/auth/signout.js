import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const signout = () => {
  const router = useRouter();
  const handleSignout = async () => {
    await axios.post('/api/users/signout', {});
    router.push('/');
  };

  useEffect(() => {
    handleSignout();
  }, []);

  return (
    <div>signout</div>
  )
}

export default signout