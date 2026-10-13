const EVENTS_API =
  "https://events.austindylan0.workers.dev/";

async function loadEvents() {
  try {
    const response = await fetch(EVENTS_API);

    if (!response.ok) {
      throw new Error(`Events API returned ${response.status}`);
    }

    const events = await response.json();

    if (!Array.isArray(events)) {
      throw new Error("Invalid events data");
    }

    console.log("Published events:", events);

    // Pass events to your existing event-rendering function.
    // Example: renderEvents(events);

    renderEvents(events);
  } catch (error) {
    console.error("Failed to load events:", error);
    return [];
  }
}

function renderEvents(events) {
  const eventsContainer = document.getElementById("events-container");

  if (!eventsContainer) {
    console.error("Events container not found");
    return;
  }

  eventsContainer.innerHTML = "";

  events.forEach((event) => {
    const eventElement = document.createElement("div");
    eventElement.classList.add("event");
    eventElement.innerHTML = `
      <h3>${event.title}</h3>
      <p>${event.description}</p>
      <p><strong>Date:</strong> ${event.date}</p>
      <p><strong>Venue:</strong> ${event.venue}</p>
      <a href="${event.ticket_url}" target="_blank" rel="noopener noreferrer">Get Tickets</a>
    `;
    eventsContainer.appendChild(eventElement);
  });

}

document.addEventListener("DOMContentLoaded", loadEvents);