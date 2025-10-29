import { useAuthStore } from "~/stores/auth";
import { ROLES } from "~/constants/role";

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();
  const publicPaths = ["/auth/login", "/auth/signup", "/"];

  if (auth.$state._isRestoring) return;

  const token = auth.token;

  if (!token && !publicPaths.includes(to.path)) {
    return navigateTo("/auth/login");
  }

  if (token && publicPaths.includes(to.path)) {
    const role = auth.user?.role;
    const schoolId = auth.user?.schoolId;

    if (role === ROLES.SUPER_ADMIN) return navigateTo("/dashboard");
    if (role === ROLES.SCHOOL_ADMIN || role === ROLES.SCHOOL_STAFF)
      return navigateTo(`/dashboard/${schoolId}`);
  }
});
