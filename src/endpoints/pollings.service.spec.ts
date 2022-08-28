import { Test, TestingModule } from '@nestjs/testing';
import { PollingsService } from './pollings.service';

describe('PollingsService', () => {
  let service: PollingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PollingsService],
    }).compile();

    service = module.get<PollingsService>(PollingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
