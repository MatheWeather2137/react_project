"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConference, setSelectedConference] = useState("All");
  const [selectedDivision, setSelectedDivision] = useState("All");
  const [sortAZ, setSortAZ] = useState(false);

  const api_url = "https://api.balldontlie.io/v1/teams";
  const api_key = "edf1f96f-7f69-4a62-90ea-89e98130b039";

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        setError(false);

        const req = await fetch(`${api_url}`, {
          headers: {
            Authorization: `Bearer ${api_key}`,
          },
        });
        if (!req.ok) {
          throw new Error(
            `HTTP error! Status: ${req.status} - ${req.statusText}`
          );
        }

        const result = await req.json();

        console.log(result);
        setTeams(result.data);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const filteredTeams = teams
    .filter((team) => {
      const hasCompleteData = team.city && team.conference && team.division;
      if (!hasCompleteData) return false;

      const matchesSearch =
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesConference =
        selectedConference === "All" || team.conference === selectedConference;
      const matchesDivision =
        selectedDivision === "All" || team.division === selectedDivision;
      return matchesSearch && matchesConference && matchesDivision;
    })
    .sort((a, b) => {
      if (sortAZ) {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  const divisions = [
    "All",
    ...Array.from(new Set(teams.map((team) => team.division))),
  ];

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading teams...</div>
      </div>
    );
  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-red-600">
          Error fetching data. Check your API key/rate limit.
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-balance text-4xl font-bold tracking-tight md:text-5xl">
          NBA Teams
        </h1>

        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button
              onClick={() => setSortAZ(!sortAZ)}
              className={`rounded-lg border px-4 py-2 font-medium transition-colors ${
                sortAZ
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {sortAZ ? "Sorted A-Z ✓" : "Sort A-Z"}
            </button>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={selectedConference}
              onChange={(e) => setSelectedConference(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Conferences</option>
              <option value="East">East</option>
              <option value="West">West</option>
            </select>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {divisions.map((division) => (
                <option key={division} value={division}>
                  {division === "All" ? "All Divisions" : division}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {filteredTeams?.map((team) => (
            <div
              key={team.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-pretty text-xl font-semibold">
                    {team.name}
                  </h2>
                  <span className="text-2xl font-bold text-gray-500">
                    {team.abbreviation}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">City:</span>
                  <span className="font-medium">{team.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Conference:</span>
                  <span className="font-medium">{team.conference}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Division:</span>
                  <span className="font-medium">{team.division}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
