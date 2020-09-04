import { InternalError } from '@src/util/errors/internal-error';
import config, { IConfig } from 'config';
import * as HTTPUtil from '@src/util/request';

export interface StormGlassPointSource {
  [key: string]: number;
}

export interface StormGlassPoint {
  readonly time: string;
  readonly waveHeight: StormGlassPointSource;
  readonly waveDirection: StormGlassPointSource;
  readonly swellDirection: StormGlassPointSource;
  readonly swellHeight: StormGlassPointSource;
  readonly swellPeriod: StormGlassPointSource;
  readonly windDirection: StormGlassPointSource;
  readonly windSpeed: StormGlassPointSource;
}

export interface StormGlassResponse {
  hours: Array<StormGlassPoint>;
}

export interface ForecastPoint {
  time: string;
  waveHeight: number;
  waveDirection: number;
  swellDirection: number;
  swellHeight: number;
  swellPeriod: number;
  windDirection: number;
  windSpeed: number;
}

export class ClientRequestError extends InternalError {
  constructor(message: string) {
    const internalMessage = `Unexpected error when trying to communicate to StormGlass`;
    super(`${internalMessage}: ${message}`);
  }
}

export class StormGlassResponseError extends InternalError {
  constructor(message: string) {
    const internalMessage =
      'Unexpected error returned by the StormGlass service';
    super(`${internalMessage}: ${message}`);
  }
}

const stormGlassResourceConfig: IConfig = config.get(
  'App.resources.StormGlass'
);

export class StormGlass {
  readonly stormGlassParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';

  readonly stormGlassSource = 'noaa';

  constructor(protected request = new HTTPUtil.Request()) {}

  public async fetchPoints(
    latitude: number,
    longitude: number
  ): Promise<Array<ForecastPoint>> {
    try {
      const response = await this.request.get<StormGlassResponse>(
        `${stormGlassResourceConfig.get(
          'apiUrl'
        )}/weather/point?lat=${latitude}&lng=${longitude}&params=${
          this.stormGlassParams
        }source=${this.stormGlassSource}`,
        {
          headers: {
            Authorization: stormGlassResourceConfig.get('apiToken'),
          },
        }
      );
      return this.normalizeResponse(response.data);
    } catch (err) {
      if (HTTPUtil.Request.isRequestError(err)) {
        throw new StormGlassResponseError(
          `Error: ${JSON.stringify(err.response.data)} Code: ${
            err.response.status
          }`
        );
      }

      throw new ClientRequestError(err.message);
    }
  }

  //funcao que recebe os dados da api externa e faz a normalizacao dos dados
  private normalizeResponse(points: StormGlassResponse): Array<ForecastPoint> {
    return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
      swellDirection: point.swellDirection[this.stormGlassSource],
      swellHeight: point.swellHeight[this.stormGlassSource],
      swellPeriod: point.swellPeriod[this.stormGlassSource],
      time: point.time,
      waveDirection: point.waveDirection[this.stormGlassSource],
      waveHeight: point.waveHeight[this.stormGlassSource],
      windDirection: point.windDirection[this.stormGlassSource],
      windSpeed: point.windSpeed[this.stormGlassSource],
    }));
  }

  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    return !!(
      point.time &&
      point.swellDirection?.[this.stormGlassSource] &&
      point.swellHeight?.[this.stormGlassSource] &&
      point.swellPeriod?.[this.stormGlassSource] &&
      point.waveDirection?.[this.stormGlassSource] &&
      point.waveHeight?.[this.stormGlassSource] &&
      point.windDirection?.[this.stormGlassSource] &&
      point.windSpeed?.[this.stormGlassSource]
    );
  }
}
