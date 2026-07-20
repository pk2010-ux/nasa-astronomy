import "./style.css";

const API_KEY = import.meta.env.VITE_NASA_API_KEY;

const app = document.querySelector("#app");

function loadAPOD(date = "") {
    app.innerHTML = `
    <div class="loading">
    <p>Receiving transmission from NASA...</p>
    </div>
    `;

  let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

  if (date) {
    url += `&date=${date}`;
  }

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Unable to fetch data from NASA.");
      }

      return response.json();
    })
    .then((data) => {
      let media;

      if (data.media_type === "image") {
        media = `
          <img
            src="${data.url}"
            alt="${data.title}"
            loading="lazy"
          >
        `;
      } else if (data.url.includes("youtube")) {
        media = `
          <iframe
            src="${data.url}"
            title="${data.title}"
            allowfullscreen>
          </iframe>
        `;
      } else {
        media = `
          <video controls>
            <source src="${data.url}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        `;
      }

      app.innerHTML = `
        <main class="container">
          <div class="tag">
            NASA Astronomy Picture of the Day
          </div>

          <div class="search">
            <input
              type="date"
              id="datePicker"
              value="${data.date}"
              max="${new Date().toISOString().split("T")[0]}"
            >

            <button id="loadBtn">
              View
            </button>
          </div>

          <h1>${data.title}</h1>

          ${media}

          <p>${data.explanation}</p>
        </main>
      `;

      const datePicker = document.getElementById("datePicker");
      const loadBtn = document.getElementById("loadBtn");

      loadBtn.addEventListener("click", () => {
        loadAPOD(datePicker.value);
      });

      datePicker.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          loadAPOD(datePicker.value);
        }
      });
    })
    .catch((err) => {
      app.innerHTML = `
        <div class="error">
          <h2>Something went wrong</h2>

          <p>${err.message}</p>

          <button id="retryBtn">
            Try Again
          </button>
        </div>
      `;

      document
        .getElementById("retryBtn")
        .addEventListener("click", () => loadAPOD());
    });
}

loadAPOD();