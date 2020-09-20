import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

@Controller('beaches')
export class BeachController {
  @Post('')
  public async create(request: Request, response: Response): Promise<void> {
    response.status(201).send({ ...request.body, id: 'fake' });
  }
}
