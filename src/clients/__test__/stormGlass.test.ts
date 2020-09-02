/**Teste:
 *
 * Pegar nos dados na Api externa e normalizar para dessa forma conseguir-mos utilizar na nossa Api
 *
 */

import axios from 'axios';
import { StormGlass } from '@src/clients/stormGlass';
import stormGlassWeather3HoursFixtures from '@test/fixtures/stormGlass_wheather_3H.json';
import stormGlassNormalized3HoursFixture from '@test/fixtures/stormGlass_normalized_response_3H.json';

//mocando a axios
jest.mock('axios');

describe('StormGlass client', () => {
  //adicionar os tipos do jest mock no axios
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  it('should return the normalized forecast from the StormGlass service', async () => {
    const latitude = -33.123123;
    const longitude = 151.123123;

    mockedAxios.get.mockResolvedValue({
      data: stormGlassWeather3HoursFixtures,
    });

    const stormGlass = new StormGlass(mockedAxios);

    const response = await stormGlass.fetchPoints(latitude, longitude);
    expect(response).toEqual(stormGlassNormalized3HoursFixture);
  });
});
