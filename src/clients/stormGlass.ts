import { AxiosStatic } from 'axios';

export class StormGlass {
  readonly stormGlassParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';

  readonly stormGlassSource = 'noaaa';

  constructor(protected request: AxiosStatic) {}

  public async fetchPoints(latitude: number, longitude: number): Promise<{}> {
    return this.request.get(
      `https://api.stormglass.io/v2/weather/point?lat=${latitude}&lng=${longitude}&params=${this.stormGlassParams}source=${this.stormGlassSource}`
    );
  }
}
