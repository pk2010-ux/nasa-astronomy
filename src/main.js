import "./style.css";

const API_KEY = import.meta.env.VITE_NASA_API_KEY;

const app = document.querySelector("#app");

// Show loading message immediately
app.innerHTML = "<p>Loading...</p>";

// Fetch Astronomy Picture of the Day
fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`)
  .then((response) => response.json())
  .then((data) => {
    let media;

    if (data.media_type === "image") {
      media = `<img src="${data.url}" alt="${data.title}" />`;
    } else if (data.url.includes("youtube")) {
      media = `
        <iframe
          src="${data.url}"
          frameborder="0"
          allowfullscreen
        ></iframe>
      `;
    } else {
      media = `
        <video controls>
          <source src="${data.url}" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      `;
    }

    app.innerHTML = `
      <main class="container">
        <h1>${data.title}</h1>
        ${media}
        <p>${data.explanation}</p>
      </main>
    `;
  })
  .catch((err) => {
    app.innerHTML = `
      <main class="container">
        <h2>Something went wrong</h2>
        <p>${err.message}</p>
      </main>
    `;
  });