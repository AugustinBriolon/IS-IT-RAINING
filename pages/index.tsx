import Search from "@/components/Search";
import { useState, useEffect } from "react";

export default function Home() {
  const [isItRaining, setIsItRaining] = useState<boolean>(false);
  const [cityHome, setCityHome] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!navigator.geolocation) {
        setError("La géolocalisation n'est pas supportée par votre navigateur.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(`/api/open-weather?latitude=${latitude}&longitude=${longitude}`);
            if (response.ok) {
              const data = await response.json();
              const isRaining = data.weather.some((condition: { main: string }) => condition.main === "Rain");
              setIsItRaining(isRaining);
            } else {
              setError("Erreur lors de la récupération des données météo.");
            }
          } catch (err) {
            setError("Erreur de requête : " + err);
          }
        },
        (err) => {
          setError(`Erreur de géolocalisation : ${err.message}`);
        }
      );
    };
    fetchWeatherData();
  }, []);

  return (
    <main className="container mx-auto h-screen p-2">
      <h1 className="text-4xl">Is It Raining {cityHome && <span className="text-xl">in {cityHome}</span>}</h1>
      <p>Check if it&apos;s raining at your location</p>
      <div className="h-3/4 w-full flex items-center justify-center">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p className="uppercase text-9xl text-center text-pretty">{isItRaining ? "Yes" : "No"}</p>
        )}
      </div>
      <Search
        onSearchResult={(isRaining) => {
          setIsItRaining(isRaining);
          setError(null);
        }}
        onError={(err) => setError(err)}
        setCityHome={setCityHome}
      />
    </main>
  );
}
