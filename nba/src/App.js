import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const api_url = "https://api.balldontlie.io/v1/teams";
  const api_key = "edf1f96f-7f69-4a62-90ea-89e98130b039";

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const req = await fetch(`${api_url}`, {
          headers: {
            Authorization: `Bearer ${api_key}`,
          },
        });
        const result = await req.json();
        setTeams(result);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);
  return <div className="App">{teams.map(teams, idx)}</div>;
}

export default App;
