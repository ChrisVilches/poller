import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  index() {
    return `The app is online! port ${process.env.PORT}, ${process.env.NODE_ENV}`
  }
}
