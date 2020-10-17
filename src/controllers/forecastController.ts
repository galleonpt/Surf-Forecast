import {
  ClassMiddleware,
  Controller,
  Get,
  Middleware,
} from '@overnightjs/core';
import { AuthMiddleware } from '@src/middleware/auth';
import { Beach } from '@src/models/beach';
import { Forecast } from '@src/services/forecast';
import APIError from '@src/util/errors/api-error';
import { Response, Request } from 'express';
import rateLimit from 'express-rate-limit';
import { BaseController } from '.';

const forecast = new Forecast();

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  keyGenerator(request: Request): string {
    return request.ip;
  },
  handler(request: Request, response: Response): void {
    response.status(429).send(
      APIError.format({
        code: 419,
        message: 'Too many request to the /forecast endpoint!',
      })
    );
  },
});

@Controller('forecast')
@ClassMiddleware(AuthMiddleware)
export class ForecastController extends BaseController {
  @Get('')
  @Middleware(rateLimiter)
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
