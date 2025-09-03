import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  tagline: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from<Profile>("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error);
        return null;
      }
      return data || null;
    } catch (err) {
      console.error("Error fetching profile (exception):", err);
      return null;
    }
  };

  const createProfile = async (userObj: User) => {
    try {
      const profileData = {
        user_id: userObj.id,
        username:
          (userObj.user_metadata as any)?.full_name
            ?.toLowerCase()
            ?.replace(/\s+/g, ".") ||
          userObj.email?.split("@")[0] ||
          null,
        avatar_url: (userObj.user_metadata as any)?.avatar_url ?? null,
        tagline: null,
        bio: null,
      };

      const { data, error } = await supabase
        .from<Profile>("profiles")
        .insert(profileData)
        .select()
        .single();

      if (error) {
        // If insert fails due to uniqueness or race, try to fetch the profile
        console.warn(
          "Error creating profile, trying to fetch existing:",
          error,
        );
        return await fetchProfile(userObj.id);
      }

      return data || null;
    } catch (err) {
      console.error("Error creating profile (exception):", err);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    const profileData = await fetchProfile(user.id);
    setProfile(profileData);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error("No user logged in");
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", user.id);

    if (error) throw error;
    await refreshProfile();
  };

  const signInWithGoogle = async () => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
    setProfile(null);
    navigate("/");
  };

  useEffect(() => {
    let mounted = true;
    let subscription: any = null;

    const initAuth = async () => {
      try {
        // Parse OAuth redirect if present and store session
        // (silently returns if not an OAuth redirect)
        await supabase.auth.getSessionFromUrl({ storeSession: true });
      } catch (err) {
        // not always an OAuth redirect — ignore
        // console.debug('getSessionFromUrl error', err)
      }

      try {
        // Get any existing session now that redirect (if any) is processed
        const { data } = await supabase.auth.getSession();
        const sess = data.session ?? null;
        if (!mounted) return;
        setSession(sess);
        setUser(sess?.user ?? null);

        if (sess?.user) {
          // Try to fetch profile; create if missing
          let profileData = await fetchProfile(sess.user.id);
          if (!profileData) {
            profileData = await createProfile(sess.user);
          }
          setProfile(profileData);
        }
      } catch (err) {
        console.error("Error during initial session fetch:", err);
      } finally {
        if (mounted) setLoading(false);
      }

      // Subscribe to auth state changes
      const { data } = supabase.auth.onAuthStateChange(async (event, sess) => {
        if (!mounted) return;
        setSession(sess ?? null);
        setUser(sess?.user ?? null);

        if (sess?.user) {
          // handle new sign-in events
          // ensure profile exists and redirect appropriately
          try {
            let profileData = await fetchProfile(sess.user.id);

            // If this is a fresh SIGNED_IN (OAuth/new session) and profile missing, create it
            if (event === "SIGNED_IN" && !profileData) {
              profileData = await createProfile(sess.user);
            }

            setProfile(profileData);

            // Redirect user: if no profile username yet, send to profile-setup; else show profile
            if (!profileData || !profileData.username) {
              navigate("/profile-setup");
            } else {
              navigate(`/profile/${profileData.username}`);
            }
          } catch (err) {
            console.error("Error handling auth state change:", err);
          }
        } else {
          setProfile(null);
        }

        if (mounted) setLoading(false);
      });

      subscription = data?.subscription;
    };

    initAuth();

    return () => {
      mounted = false;
      if (subscription?.unsubscribe) subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signInWithGoogle,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
