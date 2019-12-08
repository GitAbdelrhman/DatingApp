/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { _ServicesService } from './_Services.service';

describe('Service: _Services', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [_ServicesService]
    });
  });

  it('should ...', inject([_ServicesService], (service: _ServicesService) => {
    expect(service).toBeTruthy();
  }));
});
