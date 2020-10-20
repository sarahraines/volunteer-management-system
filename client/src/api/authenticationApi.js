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
  const email = localStorage.getItem("email");
  const response = await axiosAPI.post("user/reset_password", {
    email,
    old_password,
    new_password,
  });
  console.log("email"+ email);
  setNewHeaders(response);
  // localStorage.setItem("user", response.data);
  return response;
}

/* Currently don't need this
export async function refreshToken(refresh) {
  const response = await axiosAPI.post("token/refresh/", {
    refresh,
  });
  setNewHeaders(response);
  return response;
}
*/

export async function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export const isAuthenticated = () => {
  const token = localStorage.getItem("access_token");
  return !!token;
};