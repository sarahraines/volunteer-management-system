import axiosAPI, { setNewHeaders } from "./axiosApi";

export async function register(email, firstName, lastName, password) {
  const response = await axiosAPI.post("users/create/", {
    email,
    first_name: firstName,
    last_name: lastName,
    password,
  });
  localStorage.setItem("user", response.data);
  return response;
}

export async function registerFromInvite(email, firstName, lastName, password, invite_id) {
  const response = await axiosAPI.post("users/create-from-invite/", {
    email,
    first_name: firstName,
    last_name: lastName,
    password,
    invite_id
  });
  localStorage.setItem("user", response.data);
  return response;
}

export async function login(email, password) {
  const response = await axiosAPI.post("token/obtain/", {
    email,
    password,
  });
  localStorage.setItem("email", email);
  setNewHeaders(response);
  return response;
}

export async function reset_password(old_password, new_password) {
  const user_id = localStorage.getItem("user_id");
  const response = await axiosAPI.post("users/change-password/", {
    user_id,
    old_password,
    new_password,
  });
  return response;
}

export async function forgot_password(email) {
  const response = await axiosAPI.post("users/forgot-password/", {
    email,
  });
  return response;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_id");
  axiosAPI.defaults.headers['Authorization'] = null;
}
export const isAuthenticated = () => {
  const token = localStorage.getItem("access_token");
  return !!token;
};