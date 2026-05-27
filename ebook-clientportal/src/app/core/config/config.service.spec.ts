import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ConfigService } from './config.service';
import { AppConfig } from './config.types';

describe('ConfigService', () => {
  let service: ConfigService;
  let httpMock: HttpTestingController;

  const mockConfig: AppConfig = {
    api: { baseUrl: 'http://localhost:3000/api', imageUrl: 'http://localhost:3000' },
    company: { name: 'Test Co' },
    currency: { code: 'USD', symbol: '$' },
    insights: {},
    location: {},
    TaxSettings: {}
  } as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfigService]
    });

    service = TestBed.inject(ConfigService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load config and return values', async () => {
    const loadPromise = service.load();

    const req = httpMock.expectOne('/assets/app-config/config.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockConfig);

    await loadPromise;

    const cfg = service.get();
    expect(cfg.api.baseUrl).toBe(mockConfig.api.baseUrl);
    expect(service.api.baseUrl).toBe(mockConfig.api.baseUrl);
    expect(service.company.name).toBe(mockConfig.company.name);
  });

  it('get() should throw if not loaded', () => {
    expect(() => service.get()).toThrowError('Config not loaded!');
  });
});
