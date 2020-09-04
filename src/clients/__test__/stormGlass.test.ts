/**Teste:
 *
 * Pegar nos dados na Api externa e normalizar para dessa forma conseguir-mos utilizar na nossa Api
 *
 */
import { StormGlass } from '@src/clients/stormGlass';
import stormGlassWeather3HoursFixtures from '@test/fixtures/stormGlass_wheather_3H.json';
import stormGlassNormalized3HoursFixture from '@test/fixtures/stormGlass_normalized_response_3H.json';
import * as HTTPUtil from '@src/util/request';

//mocando axios
jest.mock('@src/util/request');

describe('StormGlass client', () => {
  // const request = axios;

  const MockedRequestClass = HTTPUtil.Request as jest.Mocked<
    typeof HTTPUtil.Request
  >;

  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>;

  it('should return the normalized forecast from the StormGlass service', async () => {
    const latitude = -33.123123;
    const longitude = 151.123123;

    mockedRequest.get.mockResolvedValue({
      data: stormGlassWeather3HoursFixtures,
    } as HTTPUtil.Response);

    const stormGlass = new StormGlass(mockedRequest);

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

    mockedRequest.get.mockResolvedValue({
      data: incompleteResponse,
    } as HTTPUtil.Response);

    const stormGlass = new StormGlass(mockedRequest);
    const response = await stormGlass.fetchPoints(latitude, longitude);

    expect(response).toEqual([]);
  });

  it('should get a generic error from StormGlass service when the request fail before reaching the service', async () => {
    const latitude = 33.333333;
    const longitude = 123.123123;

    mockedRequest.get.mockRejectedValue({ message: 'Network Error' });

    const stormGlass = new StormGlass(mockedRequest);

    await expect(stormGlass.fetchPoints(latitude, longitude)).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass: Network Error'
    );
  });

  it('should get an StormGlassResponseError when the StormGlass service responds with error', async () => {
    const latitude = -33.792726;
    const longitude = 151.289824;

    MockedRequestClass.isRequestError.mockReturnValue(true);

    mockedRequest.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ['Rate Limit reached'] },
      },
    });

    const stormGlass = new StormGlass(mockedRequest);

    await expect(stormGlass.fetchPoints(latitude, longitude)).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
