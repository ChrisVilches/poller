import { runContext } from "./runner";
import { INestApplicationContext } from "@nestjs/common";
import { EndpointsService } from "@persistence/services/endpoints.service";
import * as seedData from './db-seed.json';

runContext(async (app: INestApplicationContext) => {
  const endpointsService = app.get(EndpointsService);

  const countBefore = await endpointsService.countAll()

  if (countBefore > 0) {
    console.log(`Database is already populated (count: ${countBefore})`)
    return
  }

  await endpointsService.populateFromJson(seedData);
  const countAfter = await endpointsService.countAll()

  console.log(`Count ${countBefore} -> ${countAfter}`)
})
