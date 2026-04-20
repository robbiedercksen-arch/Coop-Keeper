// USER STATE
const [user, setUser] = useState<any>(null);
const [loading, setLoading] = useState(true);
const [offline, setOffline] = useState(!navigator.onLine);

// LOAD USER
useEffect(() => {
  const updateOnlineStatus = () => setOffline(!navigator.onLine);
  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);

  async function loadUser() {
    try {
      // 1. Load from localStorage first
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      // 2. Sync with Supabase
      const { data } = await supabase.auth.getUser();

      if (data?.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  loadUser();

  return () => {
    window.removeEventListener("online", updateOnlineStatus);
    window.removeEventListener("offline", updateOnlineStatus);
  };
}, []);

// LISTEN FOR LOGIN
useEffect(() => {
  const { data: listener } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        localStorage.setItem("user", JSON.stringify(session.user));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    }
  );

  return () => {
    listener.subscription.unsubscribe();
  };
}, []);