import { useAuthStore } from "~/stores/auth";

export const useAuth = () => {
  const store = useAuthStore();

  const user = computed(() => store.user);
  const isLoggedIn = computed(() => !!store.user);

  const login = async (email, password) => {
    await store.login(email, password);
  };

  const logout = async () => {
    await store.logout();
  };

  return { user, isLoggedIn, login, logout };
};
