import axios from 'axios';

const axiosClient = () => {
  return axios.create({
    baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
  });
}

export default axiosClient