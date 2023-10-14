import { Test, TestingModule } from '@nestjs/testing';
import { LastFmService } from './last-fm.service';

describe('LastFmService', () => {
  let service: LastFmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LastFmService],
    }).compile();

    service = module.get<LastFmService>(LastFmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
