import { INestApplicationContext } from "@nestjs/common";
import { EndpointsService } from "../src/endpoints/endpoints.service";
import { runContext } from "./runner";
import * as seedData from './seed.json';

runContext(async (app: INestApplicationContext) => {
  const endpointsService = app.get(EndpointsService);

  const countBefore = await endpointsService.countAll()
  await endpointsService.populateFromJson(seedData);
  const countAfter = await endpointsService.countAll()

  console.log(`Count ${countBefore} -> ${countAfter}`)
})
