const EVENTS_API =
  "https://events.austindylan0.workers.dev/";

async function loadEvents() {
  const eventsContainer = document.getElementById("events-container");

  if (!eventsContainer) {
    console.error("Events container not found");
    return [];
  }

  eventsContainer.innerHTML = `
    <div class="events-loading" role="status" aria-live="polite">
      <span class="loading-spinner" aria-hidden="true"></span>
      <span>Loading events...</span>
    </div>
  `;

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
    eventsContainer.innerHTML = `
      <p class="events-message" role="alert">
        Events are temporarily unavailable. Please try again later.
      </p>
    `;
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
    if (event.ticket_url) {
    eventElement.innerHTML = `
      <h3>${event.title}</h3>
      <p>${event.description}</p>
      <p><strong>Date:</strong> ${event.date}</p>
      <p><strong>Venue:</strong> ${event.venue}</p>
      <a href="${event.ticket_url}" target="_blank" rel="noopener noreferrer" class="button button-dark">Get Tickets</a>
    `;
    } else {
      eventElement.innerHTML = `
        <h3>${event.title}</h3>
        <p>${event.description}</p>
        <p><strong>Date:</strong> ${event.date}</p>
        <p><strong>Venue:</strong> ${event.venue}</p>
      <p><em>Free Entry</em></p>
      `;
    }
    eventsContainer.appendChild(eventElement);
  });

}

document.addEventListener("DOMContentLoaded", loadEvents);