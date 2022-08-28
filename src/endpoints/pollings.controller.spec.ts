import { Test, TestingModule } from '@nestjs/testing';
import { PollingsController } from './pollings.controller';
import { PollingsService } from './pollings.service';

describe('PollingsController', () => {
  let controller: PollingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PollingsController],
      providers: [PollingsService],
    }).compile();

    controller = module.get<PollingsController>(PollingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
