"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { MissionBriefing, MissionControl, MISSION_EVENTS, CREW_MEMBERS } from "../components/mission-control";
import { interpolateTelemetry, formatMET, getMissionPhase, CommMessage } from "../components/mission-control/types";

export default function ArtemisIIControl() {
  // All state and logic back in main component - exactly like original working version
  const [gameStarted, setGameStarted] = useState(false);
  const [missionTime, setMissionTime] = useState(-600.0); // 10 minutes prelaunch countdown

  const [events, setEvents] = useState(MISSION_EVENTS);
  const [commLog, setCommLog] = useState<CommMessage[]>([]);
  const [pendingApproval, setPendingApproval] = useState<string | null>(null);

  const addMessage = useCallback((from: CommMessage["from"], message: string, type: CommMessage["type"] = "info") => {
    const newMessage: CommMessage = {
      id: `comm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      time: formatMET(missionTime),
      from,
      message,
      type
    };
    setCommLog(prev => [...prev.slice(-49), newMessage]);
  }, [missionTime]);
  const [gameSpeed, setGameSpeed] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showMissionBriefing, setShowMissionBriefing] = useState(true);

  // Refs to track which messages have been sent to avoid duplicates
  const missionStartedMessageSent = useRef(false);
  const launchMessageSent = useRef(false);
  const solarDeployMessageSent = useRef(false);
  const maxqMessageSent = useRef(false);
  const boostSepMessageSent = useRef(false);
  const mecoMessageSent = useRef(false);
  const perigeeRaiseMessageSent = useRef(false);
  const apogeeRaiseMessageSent = useRef(false);
  const proxOpsMessageSent = useRef(false);
  const suitDemoMessageSent = useRef(false);
  const outboundTc1MessageSent = useRef(false);
  const outboundTc2MessageSent = useRef(false);
  const outboundTc3MessageSent = useRef(false);
  const lunarFlybyMessageSent = useRef(false);
  const returnTc1MessageSent = useRef(false);
  const radiationShelterMessageSent = useRef(false);
  const manualPilotDemoMessageSent = useRef(false);
  const returnTc2MessageSent = useRef(false);
  const entryPrepMessageSent = useRef(false);
  const serviceModuleSepMessageSent = useRef(false);
  const reentryMessageSent = useRef(false);
  const drogueDeployMessageSent = useRef(false);
  const mainDeployMessageSent = useRef(false);
  const splashdownMessageSent = useRef(false);
  const tliPrepMessageSent = useRef(false);
  const tliRequestMessageSent = useRef(false);

  // High-performance timer using requestAnimationFrame
  useEffect(() => {
    let animationId: number;
    let lastTime = performance.now();

    const updateTimer = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;

      // Update at ~60fps (every ~16.67ms) for smooth animation
      if (deltaTime >= 16.67) {
        setMissionTime(prev => {
          const newTime = prev + (gameSpeed * deltaTime / 1000); // Convert to seconds

          // Auto-start mission when countdown reaches zero
          if (!gameStarted && newTime >= 0 && !missionStartedMessageSent.current) {
            setGameStarted(true);
            // Send launch message immediately when mission starts
            addMessage("CAPCOM", "All stations, we have liftoff at 6:35 PM EDT! Godspeed, Artemis II crew.", "info");
            missionStartedMessageSent.current = true;
          }

          // Handle mission events only when game is started
          if (gameStarted) {

            // Solar array deploy at T+0:49
            if (newTime >= 49 && prev < 49 && !solarDeployMessageSent.current) {
              addMessage("SYSTEM", "Orion solar arrays fully deployed. Power systems nominal.", "system");
              setEvents(prev => prev.map(e => e.id === "solar_deploy" ? {...e, status: "completed"} : e));
              solarDeployMessageSent.current = true;
            }

            // Max-Q at T+0:56
            if (newTime >= 56 && prev < 56 && !maxqMessageSent.current) {
              addMessage("CAPCOM", "Max-Q passed. Structural loads within limits.", "info");
              setEvents(prev => prev.map(e => e.id === "maxq" ? {...e, status: "completed"} : e));
              maxqMessageSent.current = true;
            }

            // Booster sep at T+2:03 (123 seconds)
            if (newTime >= 123 && prev < 123 && !boostSepMessageSent.current) {
              addMessage("CAPCOM", "Booster separation confirmed. SRBs heading for Atlantic splashdown.", "info");
              setEvents(prev => prev.map(e => e.id === "boost_sep" ? {...e, status: "completed"} : e));
              boostSepMessageSent.current = true;
            }

            // MECO at T+8:17 (497 seconds)
            if (newTime >= 497 && prev < 497 && !mecoMessageSent.current) {
              addMessage("CDR", "Copy, Houston. Main engines cut off confirmed. We're on orbit.", "crew_report");
              addMessage("CAPCOM", "Copy, Integrity. Congratulations on a beautiful ascent, crew.", "info");
              setEvents(prev => prev.map(e => e.id === "meco" ? {...e, status: "completed"} : e));
              mecoMessageSent.current = true;
            }

            // Perigee raise at T+49:00 (2940 seconds)
            if (newTime >= 2940 && prev < 2940 && !perigeeRaiseMessageSent.current) {
              addMessage("CAPCOM", "Perigee raise burn complete. Establishing stable low Earth orbit.", "info");
              setEvents(prev => prev.map(e => e.id === "perigee_raise" ? {...e, status: "completed"} : e));
              perigeeRaiseMessageSent.current = true;
            }

            // Apogee raise at T+1:47:57 (6477 seconds)
            if (newTime >= 6477 && prev < 6477 && !apogeeRaiseMessageSent.current) {
              addMessage("CAPCOM", "Apogee raise burn complete. Orion now in high Earth orbit.", "info");
              setEvents(prev => prev.map(e => e.id === "high_orbit" ? {...e, status: "completed"} : e));
              apogeeRaiseMessageSent.current = true;
            }

            // Proximity ops at T+3:24:15 (12255 seconds)
            if (newTime >= 12255 && prev < 12255 && !proxOpsMessageSent.current) {
              addMessage("CDR", "Houston, Integrity. Commencing proximity operations demonstration.", "crew_report");
              setEvents(prev => prev.map(e => e.id === "prox_ops" ? {...e, status: "completed"} : e));
              proxOpsMessageSent.current = true;
            }

            // Suit demo at T+96:00 (345600 seconds)
            if (newTime >= 345600 && prev < 345600 && !suitDemoMessageSent.current) {
              addMessage("CAPCOM", "Crew, prepare for Orion Crew Survival System suit demonstration.", "info");
              setEvents(prev => prev.map(e => e.id === "suit_demo" ? {...e, status: "completed"} : e));
              suitDemoMessageSent.current = true;
            }

            // Outbound TC1 at T+48:00 (172800 seconds)
            if (newTime >= 172800 && prev < 172800 && !outboundTc1MessageSent.current) {
              setPendingApproval("outbound_tc1");
              setEvents(prev => prev.map(e => e.id === "outbound_tc1" ? {...e, status: "pending_approval"} : e));
              outboundTc1MessageSent.current = true;
            }

            // Outbound TC2 at T+72:00 (259200 seconds)
            if (newTime >= 259200 && prev < 259200 && !outboundTc2MessageSent.current) {
              setPendingApproval("outbound_tc2");
              setEvents(prev => prev.map(e => e.id === "outbound_tc2" ? {...e, status: "pending_approval"} : e));
              outboundTc2MessageSent.current = true;
            }

            // Outbound TC3 at T+108:00 (388800 seconds)
            if (newTime >= 388800 && prev < 388800 && !outboundTc3MessageSent.current) {
              setPendingApproval("outbound_tc3");
              setEvents(prev => prev.map(e => e.id === "outbound_tc3" ? {...e, status: "pending_approval"} : e));
              outboundTc3MessageSent.current = true;
            }

            // Lunar flyby at T+142:00 (511200 seconds)
            if (newTime >= 511200 && prev < 511200 && !lunarFlybyMessageSent.current) {
              addMessage("CDR", "Houston, we have visual on the Moon. Lunar flyby commencing.", "crew_report");
              addMessage("CAPCOM", "Copy, Integrity. Record observations for lunar science.", "info");
              setEvents(prev => prev.map(e => e.id === "lunar_flyby" ? {...e, status: "completed"} : e));
              lunarFlybyMessageSent.current = true;
            }

            // Return TC1 at T+144:00 (518400 seconds)
            if (newTime >= 518400 && prev < 518400 && !returnTc1MessageSent.current) {
              setPendingApproval("return_tc1");
              setEvents(prev => prev.map(e => e.id === "return_tc1" ? {...e, status: "pending_approval"} : e));
              returnTc1MessageSent.current = true;
            }

            // Radiation shelter at T+168:00 (604800 seconds)
            if (newTime >= 604800 && prev < 604800 && !radiationShelterMessageSent.current) {
              addMessage("CAPCOM", "Crew, initiate radiation shelter demonstration.", "info");
              setEvents(prev => prev.map(e => e.id === "radiation_shelter" ? {...e, status: "completed"} : e));
              radiationShelterMessageSent.current = true;
            }

            // Manual piloting demo at T+172:00 (619200 seconds)
            if (newTime >= 619200 && prev < 619200 && !manualPilotDemoMessageSent.current) {
              addMessage("PLT", "Houston, manual piloting demonstration underway.", "crew_report");
              setEvents(prev => prev.map(e => e.id === "manual_pilot_demo" ? {...e, status: "completed"} : e));
              manualPilotDemoMessageSent.current = true;
            }


            // Return TC2 at T+192:00 (691200 seconds)
            if (newTime >= 691200 && prev < 691200 && !returnTc2MessageSent.current) {
              setPendingApproval("return_tc2");
              setEvents(prev => prev.map(e => e.id === "return_tc2" ? {...e, status: "pending_approval"} : e));
              returnTc2MessageSent.current = true;
            }

            // Entry prep at T+216:00 (777600 seconds)
            if (newTime >= 777600 && prev < 777600 && !entryPrepMessageSent.current) {
              addMessage("CAPCOM", "Crew, begin entry preparations. Stow equipment and don suits.", "info");
              setEvents(prev => prev.map(e => e.id === "entry_prep" ? {...e, status: "completed"} : e));
              entryPrepMessageSent.current = true;
            }


            // Service module sep at T+223:00 (802800 seconds)
            if (newTime >= 802800 && prev < 802800 && !serviceModuleSepMessageSent.current) {
              addMessage("SYSTEM", "Service module separation confirmed.", "system");
              setEvents(prev => prev.map(e => e.id === "service_module_sep" ? {...e, status: "completed"} : e));
              serviceModuleSepMessageSent.current = true;
            }

            // Reentry at T+223:20 (803200 seconds)
            if (newTime >= 803200 && prev < 803200 && !reentryMessageSent.current) {
              addMessage("CAPCOM", "Reentry commencing. Communications blackout expected in 4 minutes.", "warning");
              setEvents(prev => prev.map(e => e.id === "reentry" ? {...e, status: "completed"} : e));
              reentryMessageSent.current = true;
            }

            // Drogue deploy at T+223:35 (803500 seconds)
            if (newTime >= 803500 && prev < 803500 && !drogueDeployMessageSent.current) {
              addMessage("SYSTEM", "Drogue parachutes deployed.", "system");
              setEvents(prev => prev.map(e => e.id === "drogue_deploy" ? {...e, status: "completed"} : e));
              drogueDeployMessageSent.current = true;
            }

            // Main deploy at T+223:40 (803600 seconds)
            if (newTime >= 803600 && prev < 803600 && !mainDeployMessageSent.current) {
              addMessage("SYSTEM", "Main parachutes deployed.", "system");
              setEvents(prev => prev.map(e => e.id === "main_deploy" ? {...e, status: "completed"} : e));
              mainDeployMessageSent.current = true;
            }

            // Splashdown at T+224:00 (806400 seconds)
            if (newTime >= 806400 && prev < 806400 && !splashdownMessageSent.current) {
              addMessage("CAPCOM", "Splashdown! Welcome home, Artemis II crew.", "info");
              setEvents(prev => prev.map(e => e.id === "splashdown" ? {...e, status: "completed"} : e));
              splashdownMessageSent.current = true;
            }


            // TLI prep at T+4:10:41 (15041 seconds, 10s before TLI)
            if (newTime >= 15041 && prev < 15041 && !tliPrepMessageSent.current) {
              setPendingApproval("tli");
              setEvents(prev => prev.map(e => e.id === "tli" ? {...e, status: "pending_approval"} : e));
              addMessage("CAPCOM", "Orion, Houston. TLI prep complete. We are tracking for burn approval.", "info");
              tliPrepMessageSent.current = true;
            }

            if (newTime >= 15041 && newTime < 15051 && pendingApproval === "tli" && !tliRequestMessageSent.current) {
              addMessage("CAPCOM", "Orion, Houston. Requesting TLI burn approval. All systems are go.", "approval_request");
              tliRequestMessageSent.current = true;
            }
          }

          return newTime;
        });
        lastTime = currentTime;
      }

      // Continue the animation loop if game is active or in countdown
      if (gameStarted || missionTime < 0) {
        animationId = requestAnimationFrame(updateTimer);
      }
    };

    // Start the animation loop
    animationId = requestAnimationFrame(updateTimer);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [gameSpeed, gameStarted, missionTime]);

  // Memoized telemetry calculation for better performance
  const telemetry = useMemo(() => interpolateTelemetry(missionTime), [missionTime]);
  const currentPhase = useMemo(() => getMissionPhase(missionTime), [missionTime]);

  // Mission events are handled in the timer callback to avoid useEffect setState issues

  const startMission = useCallback(() => {
    setShowMissionBriefing(false);
    addMessage("SYSTEM", "Artemis II Mission Control online. All stations report ready.", "system");
    addMessage("SYSTEM", "Crew ingress complete. Hatch secured.", "system");
    addMessage("SYSTEM", "Pre-launch countdown initiated. T-10:00:00 to launch.", "system");
  }, [addMessage]);

  const approveBurn = useCallback((eventId: string) => {
    setEvents(prev => prev.map(e =>
      e.id === eventId ? { ...e, status: "completed", approved: true, outcome: "success" } : e
    ));
    setPendingApproval(null);
    const eventTitle = events.find(e => e.id === eventId)?.title || eventId;
    addMessage("CAPCOM", `Burn executed for ${eventTitle}. Trajectory nominal.`, "info");
  }, [events, addMessage]);

  const holdBurn = useCallback((eventId: string, eventTitle: string) => {
    setEvents(prev => prev.map(e => e.id === eventId ? {...e, status: "upcoming"} : e));
    setPendingApproval(null);
    addMessage("CAPCOM", `Hold on ${eventTitle}. Standby for further review.`, "alert");
  }, [addMessage]);

  if (showMissionBriefing) {
    return <MissionBriefing onStartMission={startMission} />;
  }

  // Show mission control during countdown and mission
  return (
    <MissionControl
      missionTime={missionTime}
      telemetry={telemetry}
      currentPhase={currentPhase}
      events={events}
      commLog={commLog}
      gameSpeed={gameSpeed}
      selectedEvent={selectedEvent}
      onGameSpeedChange={setGameSpeed}
      onEventSelect={setSelectedEvent}
      onBurnApprove={approveBurn}
      onBurnHold={holdBurn}
      formatTime={formatMET}
    />
  );
}