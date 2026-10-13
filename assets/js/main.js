const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const signupForm = document.querySelector(".signup-form");
const formMessage = document.querySelector(".form-message");

// Mobile navigation
menuToggle?.addEventListener("click", () => {
    const isOpen = nav?.classList.toggle("is-open") ?? false;

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close menu" : "Open menu"
    );
});

nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        menuToggle?.setAttribute("aria-expanded", "false");
        menuToggle?.setAttribute("aria-label", "Open menu");
    });
});

// Mailing list signup
signupForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const button = signupForm.querySelector('button[type="submit"], button');
    const emailInput = signupForm.elements.namedItem("email");

    if (!emailInput || !formMessage || !button) {
        console.error("Signup form is missing a required element.");
        return;
    }

    const email = emailInput.value.trim();

    if (!email) {
        formMessage.textContent = "Please enter your email address.";
        return;
    }

    button.disabled = true;
    formMessage.textContent = "Adding you to the list...";

    try {
        const message = await subscribeToMailingList(email);

        formMessage.textContent =
            message === "Email already subscribed"
                ? "You're already on the list. Thanks for being here!"
                : "You're on the list. Thanks for being here!";

        signupForm.reset();
    } catch (error) {
        console.error("Mailing list signup failed:", error);

        formMessage.textContent =
            error.message || "Something went wrong. Please try again.";
    } finally {
        button.disabled = false;
    }
});

// Footer year
const yearElement = document.querySelector("#year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// Send signup to your Cloudflare Worker
async function subscribeToMailingList(email) {
    const response = await fetch(
        "https://mailinglist.austindylan0.workers.dev/",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email.trim()
            })
        }
    );

    let result;

    try {
        result = await response.json();
    } catch {
        throw new Error(
            "The server returned an unexpected response. Please try again."
        );
    }

    if (!response.ok || !result.success) {
        throw new Error(
            result.error || "Signup failed. Please try again."
        );
    }

    return result.message || "Email added successfully";
}