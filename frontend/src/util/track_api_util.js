import axios from "axios";

export const getTracks = () => {
  return axios.get("/api/tracks");
};

export const createTrack = (data) => {
  return axios.post("/api/tracks", data);
};

export const editTrack = ({ track }) => {
  return axios.patch(`/api/tracks/${track.id}`, track.blocks);
};

export const deleteTrack = (trackId) => {
  return axios.delete(`/api/tracks/${trackId}`);
};