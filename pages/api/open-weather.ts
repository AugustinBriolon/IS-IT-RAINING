import type { NextApiRequest, NextApiResponse } from 'next';

const fetchWeatherByCoords = async (latitude: string, longitude: string, apiKey: string) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&lang=fr&units=metric`;
  const response = await fetch(url);
  return response.json();
};

const fetchWeatherByCity = async (city: string, apiKey: string) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=fr&units=metric`;
  const response = await fetch(url);
  return response.json();
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { latitude, longitude, city } = req.query;
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ message: 'La clé API OpenWeather n\'est pas configurée.' });
  }

  try {
    let data;
    if (city) {
      data = await fetchWeatherByCity(city as string, apiKey);
    } else if (latitude && longitude) {
      data = await fetchWeatherByCoords(latitude as string, longitude as string, apiKey);
    } else {
      return res.status(400).json({ message: 'Latitude, longitude ou nom de la ville requis.' });
    }

    if (data.cod && data.cod !== 200) {
      return res.status(data.cod).json({ message: data.message });
    }

    res.status(200).json(data);
  } catch (error: unknown) {
    res.status(500).json({ message: 'Erreur interne du serveur.', error: (error as Error).message });
  }
}
