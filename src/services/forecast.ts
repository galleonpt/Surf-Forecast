import { StormGlass, ForecastPoint } from '@src/clients/stormGlass';
import { InternalError } from '@src/util/errors/internal-error';

export enum BeachPosition {
  S = 'S',
  E = 'E',
  N = 'N',
  W = 'W',
}

export interface Beach {
  name: string;
  position: BeachPosition;
  lat: number;
  lng: number;
  user: string;
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export interface TimeForecast {
  time: string;
  forecast: Array<BeachForecast>;
}

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    super(`Unexpecting error during the forecast processing: ${message}`);
  }
}

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(
    beaches: Array<Beach>
  ): Promise<Array<TimeForecast>> {
    const pointsWithCorrectSources: Array<BeachForecast> = [];

    try {
      for (const beach of beaches) {
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);

        const enrichedBeachData = this.enrichedBeachData(points, beach);

        pointsWithCorrectSources.push(...enrichedBeachData);
      }
      return this.mapForecastByTime(pointsWithCorrectSources);
    } catch (err) {
      throw new ForecastProcessingInternalError(err.message);
    }
  }

  private enrichedBeachData(
    points: Array<ForecastPoint>,
    beach: Beach
  ): Array<BeachForecast> {
    return points.map((data) => ({
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: 1,
      },
      ...data,
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
