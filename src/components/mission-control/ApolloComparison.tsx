"use client";

interface ApolloMission {
  mission: string;
  year: number;
  crew: number;
  duration: string;
  maxDistance: string;
  achievements: string[];
  spacecraft: string;
}

const APOLLO_MISSIONS: ApolloMission[] = [
  {
    mission: "Apollo 8",
    year: 1968,
    crew: 3,
    duration: "6 days, 3 hours",
    maxDistance: "234,474 miles",
    achievements: [
      "First crewed lunar orbit",
      "First Earthrise photo from lunar orbit",
      "First crewed flight of Saturn V"
    ],
    spacecraft: "Apollo CSM"
  },
  {
    mission: "Apollo 11",
    year: 1969,
    crew: 3,
    duration: "8 days, 3 hours",
    maxDistance: "248,655 miles",
    achievements: [
      "First human lunar landing",
      "First steps on the Moon",
      "First lunar sample return"
    ],
    spacecraft: "Apollo CSM + LM"
  },
  {
    mission: "Apollo 13",
    year: 1970,
    crew: 3,
    duration: "5 days, 22 hours",
    maxDistance: "248,655 miles",
    achievements: [
      "Successful return after oxygen tank explosion",
      "First crewed flight without lunar landing",
      "Demonstrated spacecraft reliability"
    ],
    spacecraft: "Apollo CSM + LM"
  },
  {
    mission: "Apollo 17",
    year: 1972,
    crew: 3,
    duration: "12 days, 13 hours",
    maxDistance: "248,655 miles",
    achievements: [
      "Last human lunar mission",
      "Most lunar samples collected",
      "First night launch to Moon"
    ],
    spacecraft: "Apollo CSM + LM"
  }
];

export function ApolloComparison() {
  return (
    <div className="bg-neutral-800 rounded p-3">
      <h3 className="text-sm font-bold text-cyan-400 mb-3 text-center">APOLLO MISSIONS COMPARISON</h3>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {APOLLO_MISSIONS.map((mission) => (
          <div key={mission.mission} className="bg-neutral-700 rounded p-2">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-white">{mission.mission}</span>
              <span className="text-cyan-400 text-xs">{mission.year}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs mb-2">
              <div>
                <span className="text-neutral-400">Crew:</span>
                <span className="text-white ml-1">{mission.crew}</span>
              </div>
              <div>
                <span className="text-neutral-400">Duration:</span>
                <span className="text-white ml-1">{mission.duration}</span>
              </div>
              <div className="col-span-2">
                <span className="text-neutral-400">Max Distance:</span>
                <span className="text-white ml-1">{mission.maxDistance}</span>
              </div>
            </div>

            <div className="mb-2">
              <span className="text-neutral-400 text-xs">Spacecraft:</span>
              <span className="text-cyan-300 text-xs ml-1">{mission.spacecraft}</span>
            </div>

            <div>
              <span className="text-neutral-400 text-xs block mb-1">Key Achievements:</span>
              <ul className="text-white text-xs space-y-0.5">
                {mission.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-cyan-400 mr-1">•</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {/* Artemis II Comparison */}
        <div className="bg-cyan-900/30 border border-cyan-600 rounded p-2">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-cyan-300">Artemis II</span>
            <span className="text-cyan-400 text-xs">2026</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs mb-2">
            <div>
              <span className="text-neutral-400">Crew:</span>
              <span className="text-white ml-1">4</span>
            </div>
            <div>
              <span className="text-neutral-400">Duration:</span>
              <span className="text-white ml-1">~10 days</span>
            </div>
            <div className="col-span-2">
              <span className="text-neutral-400">Max Distance:</span>
              <span className="text-white ml-1">~280,000 miles</span>
            </div>
          </div>

          <div className="mb-2">
            <span className="text-neutral-400 text-xs">Spacecraft:</span>
            <span className="text-cyan-300 text-xs ml-1">Orion + ICPS</span>
          </div>

          <div>
            <span className="text-neutral-400 text-xs block mb-1">Key Achievements:</span>
            <ul className="text-white text-xs space-y-0.5">
              <li className="flex items-start">
                <span className="text-cyan-400 mr-1">•</span>
                <span>First crewed lunar orbit since Apollo 17</span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-400 mr-1">•</span>
                <span>Most distant crewed mission (surpassing Apollo 13)</span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-400 mr-1">•</span>
                <span>Gateway to Artemis III lunar landing</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}