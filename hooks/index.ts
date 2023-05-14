import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Subscription } from "@supabase/supabase-js";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [authSubscription, setAuthSubscription] = useState<Subscription>();

  useEffect(() => {
    (async () => {
      const response = await supabase.auth.getSession();
      //
      setUser(response.data.session?.user ?? null);

      const { data } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          setUser(session?.user ?? null);
        }
      );
      setAuthSubscription(data.subscription);
    })();

    return () => {
      authSubscription?.unsubscribe();
    };
  }, []);

  return { user };
};
