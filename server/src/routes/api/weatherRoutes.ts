
import { Router, type Request, type Response } from 'express';
const router = Router();
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
// TODO: POST Request with city name to retrieve weather data

router.post('/', async (req: Request, res: Response) => {
  const { city } = req.body;
  if (!city) {
    res.status(400).json({ error: 'City name is required' });
    return;
  }
  try {
    console.log("a string", city);

    // Fetch weather data from the weather service
    const weatherData = await WeatherService.getWeatherForCity(city);

    // Return the data in the format the frontend expects (array of [current, forecast])
    res.json([weatherData.current, ...weatherData.forecast]);

    console.log('[weatherRoutes] loaded');
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
    console.log('[weatherRoutes] loaded');
  }
});


// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const savedCities = await HistoryService.getCities();
    res.json(savedCities);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  try {
    if (!req.params.id) {
      res.status(400).json({ msg: 'City id is required' });
    }
    await HistoryService.removeCity(req.params.id);
    res.json({ success: 'City successfully removed from search history' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
export default router;