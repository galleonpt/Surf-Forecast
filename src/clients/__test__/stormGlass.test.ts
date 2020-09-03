/**Teste:
 *
 * Pegar nos dados na Api externa e normalizar para dessa forma conseguir-mos utilizar na nossa Api
 *
 */

import axios from 'axios';
import { StormGlass } from '@src/clients/stormGlass';
import stormGlassWeather3HoursFixtures from '@test/fixtures/stormGlass_wheather_3H.json';
import stormGlassNormalized3HoursFixture from '@test/fixtures/stormGlass_normalized_response_3H.json';
import { exitCode } from 'process';

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

  it('should exclude imcomplete data poins', async () => {
    const latitude = 33.333333;
    const longitude = 123.123123;

    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300,
          },
          time: '2020-04-26T00:00:00+00:00',
        },
      ],
    };

    mockedAxios.get.mockResolvedValue({ data: incompleteResponse });

    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(latitude, longitude);

    expect(response).toEqual([]);
  });

  it('should get a generic error from StormGlass service when the request fail before reaching the service', async () => {
    const latitude = 33.333333;
    const longitude = 123.123123;

    mockedAxios.get.mockRejectedValue({ message: 'Network error' });

    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(latitude, longitude);

    expect(response).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass: Network Error'
    );
  });
});
