import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { EndpointsService } from "../src/endpoints/endpoints.service";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false
  });
  const endpointsService = app.get(EndpointsService);

  const countBefore = await endpointsService.countAll()
  await endpointsService.seed();
  const countAfter = await endpointsService.countAll()

  console.log(`Count ${countBefore} -> ${countAfter}`)

  await app.close()
}

bootstrap();
