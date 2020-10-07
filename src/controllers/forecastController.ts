import { ClassMiddleware, Controller, Get } from '@overnightjs/core';
import { AuthMiddleware } from '@src/middleware/auth';
import { Beach } from '@src/models/beach';
import { Forecast } from '@src/services/forecast';
import { Response, Request } from 'express';
import { BaseController } from '.';

const forecast = new Forecast();

@Controller('forecast')
@ClassMiddleware(AuthMiddleware)
export class ForecastController extends BaseController {
  @Get('')
  public async getForecastLoggedUser(
    request: Request,
    response: Response
  ): Promise<void> {
    try {
      const userID = request.decoded?.id;

      const beaches = await Beach.find({ user: userID });
      const forecastData = await forecast.processForecastForBeaches(beaches);

      response.status(200).send(forecastData);
    } catch (err) {
      this.sendErrorResponse(response, {
        code: 500,
        message: 'Something went wrong',
      });
    }
  }
}
