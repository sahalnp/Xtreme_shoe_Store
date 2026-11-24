import { useSelector, useDispatch } from "react-redux";
import { setUser, clearUser } from "../features/UserSlice.js";
import { loginUser } from "../api/client.js";

export function useAuth() {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated } = useSelector((state) => state.user);

  const login = async (username, password) => {
    const data = await loginUser(username, password);
    dispatch(setUser({ user: data.user, token: data.token }));
    return data;
  };

  const logout = () => {
    dispatch(clearUser());
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
  };
}

export default useAuth;
