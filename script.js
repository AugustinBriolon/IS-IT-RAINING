document.addEventListener('DOMContentLoaded', function() {
  const result = document.getElementById('result');

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    result.innerHTML = "Geolocation is not supported by this browser.";
  }

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const apiKey = '18711f89c687998fa3625165faa8e436'
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const weather = data.weather[0].main.toLowerCase();
        console.log(weather);
        if (weather.includes('rain')) {
          result.innerHTML = "yes";
        } else {
          result.innerHTML = "no";
        }
      })
      .catch(() => {
        result.innerHTML = "Please enable your location.";
      });
  }

  function error() {
    result.innerHTML = "Please enable your location.";
  }
});