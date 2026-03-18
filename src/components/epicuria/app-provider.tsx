"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createFavorite,
  deleteFavorite,
  fetchFavoritesForUser,
  loginRequest,
  registerRequest,
  type SessionUser,
  type SessionData,
} from "@/lib/epicuria-api";

const SESSION_STORAGE_KEY = "epicuria.session";

type FavoriteMap = Record<number, number>;

type AppProviderValue = {
  session: SessionData | null;
  isReady: boolean;
  authLoading: boolean;
  favorites: FavoriteMap;
  favoriteAddedPulse: number;
  login: (input: { email: string; password: string }) => Promise<void>;
  register: (input: {
    first_name?: string;
    email: string;
    username: string;
    password: string;
  }) => Promise<void>;
  updateSessionUser: (user: SessionUser) => void;
  logout: () => void;
  refreshFavorites: () => Promise<void>;
  toggleFavorite: (recipeId: number) => Promise<{ requiresAuth: boolean }>;
};

const AppContext = createContext<AppProviderValue | undefined>(undefined);

function mapFavorites(records: Awaited<ReturnType<typeof fetchFavoritesForUser>>) {
  return records.reduce<FavoriteMap>((accumulator, record) => {
    accumulator[record.recipe_id] = record.id;
    return accumulator;
  }, {});
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionData | null>(null);
  const [favorites, setFavorites] = useState<FavoriteMap>({});
  const [isReady, setIsReady] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [favoriteAddedPulse, setFavoriteAddedPulse] = useState(0);

  useEffect(() => {
    const storedSession = window.localStorage.getItem(SESSION_STORAGE_KEY);

    if (storedSession) {
      try {
        setSession(JSON.parse(storedSession) as SessionData);
      } catch {
        window.localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!session?.user.id) {
      setFavorites({});
      return;
    }

    void (async () => {
      const records = await fetchFavoritesForUser(session.user.id);
      setFavorites(mapFavorites(records));
    })();
  }, [session]);

  const persistSession = (nextSession: SessionData | null) => {
    setSession(nextSession);

    if (nextSession) {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
      return;
    }

    window.localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const login = async (input: { email: string; password: string }) => {
    setAuthLoading(true);

    try {
      const nextSession = await loginRequest(input);
      persistSession(nextSession);
      const records = await fetchFavoritesForUser(nextSession.user.id);
      setFavorites(mapFavorites(records));
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (input: {
    first_name?: string;
    email: string;
    username: string;
    password: string;
  }) => {
    setAuthLoading(true);

    try {
      await registerRequest(input);
      const nextSession = await loginRequest({
        email: input.email,
        password: input.password,
      });
      persistSession(nextSession);
      setFavorites({});
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    persistSession(null);
    setFavorites({});
    setFavoriteAddedPulse(0);
  };

  const updateSessionUser = (user: SessionUser) => {
    setSession((current) => {
      if (!current) {
        return current;
      }

      const nextSession = { ...current, user };
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
      return nextSession;
    });
  };

  const refreshFavorites = async () => {
    if (!session?.user.id) {
      setFavorites({});
      return;
    }

    const records = await fetchFavoritesForUser(session.user.id);
    setFavorites(mapFavorites(records));
  };

  const toggleFavorite = async (recipeId: number) => {
    if (!session?.user.id) {
      return { requiresAuth: true };
    }

    const existingFavoriteId = favorites[recipeId];

    if (existingFavoriteId) {
      await deleteFavorite(existingFavoriteId);
    } else {
      await createFavorite({
        user_id: session.user.id,
        recipe_id: recipeId,
      });
      setFavoriteAddedPulse((current) => current + 1);
    }

    await refreshFavorites();
    return { requiresAuth: false };
  };

  const value: AppProviderValue = {
    session,
    isReady,
    authLoading,
    favorites,
    favoriteAddedPulse,
    login,
    register,
    updateSessionUser,
    logout,
    refreshFavorites,
    toggleFavorite,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppSession() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppSession must be used inside AppProvider");
  }

  return context;
}
