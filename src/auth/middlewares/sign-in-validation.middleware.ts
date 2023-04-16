import {
  BadRequestException,
  Injectable,
  NestMiddleware
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { SignInRequestBody } from '../models/SignInRequestBody';
import { validate } from 'class-validator';

@Injectable()
export class SignInValidationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const body = req.body;

    const signInRequestBody = new SignInRequestBody(body.email, body.password);

    const validations = await validate(signInRequestBody);

    if (validations.length) {
      throw new BadRequestException(
        validations.reduce((acc, curr) => {
          return [...acc, ...Object.values(curr.constraints)];
        }, [])
      );
    }

    next();
  }
}
