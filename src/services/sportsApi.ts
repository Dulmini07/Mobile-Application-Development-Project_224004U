import axios from 'axios';

const API = 'https://www.thesportsdb.com/api/v1/json/3';

export const fetchMatches = async () => {
  const res = await axios.get(`${API}/eventsnextleague.php?id=4328`);
  return res.data?.events ?? [];
};

export const fetchEventDetails = async (id: string) => {
  const res = await axios.get(`${API}/lookupevent.php?id=${id}`);
  return res.data?.events?.[0] ?? null;
};

export const fetchPlayers = async (teamId: string) => {
  if (!teamId) return [];
  const res = await axios.get(`${API}/lookup_all_players.php?id=${teamId}`);
  return res.data?.player ?? [];
};
