import axios from 'axios';

const axiosClient = ({ req }) => {
  return axios.create({
    baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
    headers: req.headers,
  });
}

export default axiosClient