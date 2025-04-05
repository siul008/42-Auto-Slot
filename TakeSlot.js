function checkInput(minRange, maxRange) {
  if (isNaN(minRange) || isNaN(maxRange)) {
    throw Error("❌ Invalid input: please enter valid numbers.");
  }

  if (minRange > maxRange) {
    throw Error("❌ Your minimum range cannot be bigger than the maximum range.");
  }

  if (maxRange > 23) {
    throw Error("❌ Your maximum range cannot be bigger than 23.");
  }

  if (minRange < 0 || maxRange < 0) {
    throw Error("❌ Your range cannot be negative.");
  }
}

function buildUrl(today, projectName, teamId) {
  const formatDate = (date) => date.toISOString().split("T")[0];
  const oneWeekLater = new Date(today);
  oneWeekLater.setDate(today.getDate() + 6);

  return `https://projects.intra.42.fr/projects/${projectName}/slots.json?team_id=${teamId}&start=${formatDate(today)}&end=${formatDate(oneWeekLater)}`;
}

function getToken() {
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
  if (!csrfToken) {
    throw Error("CSRF token not found!");
  }
  return csrfToken;
}

function filterSlots(minRange, maxRange, slots, today) {
  return slots.filter(slot => {
    if (!slot.start) return false;
    const date = new Date(slot.start);
    return (
      date.toDateString() === today.toDateString() &&
      date.getHours() >= minRange &&
      date.getHours() <= maxRange
    );
  });
}

async function bookSlot(slot, projectName, teamId, csrfToken) {
  const encodedTeamId = slot.ids.split(",")[0];
  const slotId = slot.id;
  const beginAt = slot.start;
  const endAt = slot.end;

  const bookingResponse = await fetch(`https://projects.intra.42.fr/projects/${projectName}/slots/${slotId},${encodedTeamId}.json?team_id=${teamId}`, {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "x-csrf-token": csrfToken,
      "x-requested-with": "XMLHttpRequest"
    },
    body: `start=${encodeURIComponent(beginAt)}&end=${encodeURIComponent(endAt)}&_method=put`,
    credentials: "include"
  });

  const bookingResult = await bookingResponse.json();
  console.log("🎉 Slot successfully booked:", bookingResult);
}

(async function autoBookSlot() {
  const minRange = parseInt(prompt("Enter your minimum hour (0–23):"));
  const maxRange = parseInt(prompt("Enter your maximum hour (0–23):"));

  try {
    checkInput(minRange, maxRange);
  } catch (e) {
    console.error(e.message);
    return;
  }
  const confirmStart = window.confirm("Start booking one slot now?");
  if (!confirmStart) {
    throw Error("⛔ Auto-booking cancelled by user.");
  }

  const today = new Date();
  const teamId = new URLSearchParams(window.location.search).get("team_id");
  const projectName = window.location.pathname.split("/")[2];
  const csrfToken = getToken();
  const url = buildUrl(today, projectName, teamId);

  console.log(`🔍 Searching slots for project "${projectName}" between ${minRange}h and ${maxRange}h, teamID is ${teamId}`);
  console.log(`⏳ Auto-booking started...`);

  const intervalId = setInterval(async () => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "accept": "application/json",
          "x-csrf-token": csrfToken,
          "x-requested-with": "XMLHttpRequest"
        },
        credentials: "include"
      });

      const slots = await response.json();
      console.log(`📦 All slots fetched (${slots.length}):`, slots);

      const matches = filterSlots(minRange, maxRange, slots, today);
      console.log(`🔎 Checked at ${new Date().toLocaleTimeString()} | Found ${matches.length} matching slot(s)`);

      if (matches.length > 0) {
        await bookSlot(matches[0], projectName, teamId, csrfToken);
        clearInterval(intervalId);
      }
    } catch (error) {
      console.error("❌ Error during booking process:", error);
    }
  }, 5000);
})();
