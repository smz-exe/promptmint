import { useAuth as useAuthContext } from "~/lib/auth/context";

export const useAuth = () => {
  return useAuthContext();
};

export const useUser = () => {
  const { user } = useAuthContext();
  return user;
};

export const useSession = () => {
  const { session } = useAuthContext();
  return session;
};
