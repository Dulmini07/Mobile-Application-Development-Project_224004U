import axios from 'axios';

const API = 'https://dummyjson.com';

type LoginParams = { username: string; password: string };
type RegisterParams = { username: string; password: string; email?: string };

export async function loginApi({ username, password }: LoginParams) {
  const res = await axios.post(
    `${API}/auth/login`,
    { username, password },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return res.data; // returns user + token
}

export async function registerApi({ username, password, email }: RegisterParams) {
  const res = await axios.post(`${API}/users/add`, { username, password, email });
  return res.data; // returns created user
}
