import { runContext } from './runner';
import { INestApplicationContext } from '@nestjs/common';
import { EndpointsService } from '@persistence/services/endpoints.service';
import * as seedData from './db-seed.json';
import { SeedService } from '@persistence/services/seed.service';

runContext(async (app: INestApplicationContext) => {
  const endpointsService = app.get(EndpointsService);
  const seedService = app.get(SeedService);

  const countBefore = await endpointsService.countAll();

  if (countBefore > 0) {
    console.log(`Database is already populated (count: ${countBefore})`);
    return;
  }

  try {
    const createdIds = await seedService.populateFromJson(seedData);
    console.log('Created. IDs:');
    console.log(createdIds);
  } catch (e) {
    console.error('Aborted');
    console.error(e);
  }

  const countAfter = await endpointsService.countAll();

  console.log(`Count ${countBefore} -> ${countAfter}`);
});
