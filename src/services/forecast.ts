import { StormGlass, ForecastPoint } from '@src/clients/stormGlass';

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

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(
    beaches: Array<Beach>
  ): Promise<Array<BeachForecast>> {
    const pointsWithCorrecetSources: Array<BeachForecast> = [];

    for (const beach of beaches) {
      const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);

      const enrichedBeachData = points.map((data) => ({
        ...{
          lat: beach.lat,
          lng: beach.lng,
          name: beach.name,
          position: beach.position,
          rating: 1,
        },
        ...data,
      }));
      pointsWithCorrecetSources.push(...enrichedBeachData);
    }
    return pointsWithCorrecetSources;
  }
}
