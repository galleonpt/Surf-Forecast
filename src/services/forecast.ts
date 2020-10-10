import { StormGlass, ForecastPoint } from '@src/clients/stormGlass';
import { Beach } from '@src/models/beach';
import { InternalError } from '@src/util/errors/internal-error';
import { Rating } from './rating';
import lodash from 'lodash'

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export interface TimeForecast {
  time: string;
  forecast: Array<BeachForecast>;
}

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`);
  }
}

export class Forecast {
  constructor(protected stormGlass = new StormGlass(), protected RatingService:typeof Rating=Rating) {}

  public async processForecastForBeaches(
    beaches: Array<Beach>
  ): Promise<Array<TimeForecast>> {
    
    try{
      const beachForecast = await this.calculateRating(beaches);
      const timeForecast = this.mapForecastByTime(beachForecast);
      
      return timeForecast.map(time=>({
        time: time.time,
        forecast:lodash.orderBy(time.forecast, ['rating'], ['desc'])
      }))

    } catch (err) {
      throw new ForecastProcessingInternalError(err.message);
    }
  }

  private async calculateRating(beaches: Array<Beach>): Promise<Array<BeachForecast>>{
    const pointsWithCorrectSources: Array<BeachForecast> = [];

      for (const beach of beaches) {
        const rating = new this.RatingService(beach);

        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);

        const enrichedBeachData = this.enrichedBeachData(points, beach, rating);

        pointsWithCorrectSources.push(...enrichedBeachData);
      
      const timeForecast = this.mapForecastByTime(pointsWithCorrectSources);

    }
    return pointsWithCorrectSources;
  }
  

  private enrichedBeachData(
    points: Array<ForecastPoint>,
    beach: Beach,
    rating:Rating
  ): Array<BeachForecast> {
    return points.map((point) => ({
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: rating.getRatingForPoint(point),
      },
      ...point,
    }));
  }

  private mapForecastByTime(
    forecast: Array<BeachForecast>
  ): Array<TimeForecast> {
    const forecastByTime: Array<TimeForecast> = [];

    for (const point of forecast) {
      const timePoint = forecastByTime.find((f) => f.time === point.time);

      if (!timePoint) {
        forecastByTime.push({
          time: point.time,
          forecast: [point],
        });
      } else timePoint.forecast.push(point);
    }
    return forecastByTime;
  }
}
