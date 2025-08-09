import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduccardDetails } from './produccard-details';

describe('ProduccardDetails', () => {
  let component: ProduccardDetails;
  let fixture: ComponentFixture<ProduccardDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduccardDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProduccardDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
