import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";

export const runApp = (callback: Function) => {
  async function bootstrap() {
    const app = await NestFactory.create(AppModule, { logger: false });
    await app.listen(0);

    await callback(app)
    await app.close()
  }
  bootstrap();
}

export const runContext = (callback: Function) => {
  async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule, {
      logger: false
    });

    await callback(app)
    await app.close()
  }
  bootstrap();
}
