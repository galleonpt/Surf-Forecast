import { ClassMiddleware, Controller, Get } from '@overnightjs/core';
import { AuthMiddleware } from '@src/middlewares/auth';
import { Beach } from '@src/models/beach';
import { Forecast } from '@src/services/forecast';
import { Request, Response } from 'express';

const forecast = new Forecast();

@Controller('forecast')
@ClassMiddleware(AuthMiddleware)
export class ForecastController {
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
      response.status(500).send({ error: 'Something went wrong' });
    }
  }
}
