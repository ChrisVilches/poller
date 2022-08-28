import { Test, TestingModule } from '@nestjs/testing';
import { EndpointsController } from './endpoints.controller';
import { EndpointsService } from './endpoints.service';

describe('EndpointsController', () => {
  let controller: EndpointsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EndpointsController],
      providers: [EndpointsService],
    }).compile();

    controller = module.get<EndpointsController>(EndpointsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
