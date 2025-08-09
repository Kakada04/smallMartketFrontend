import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsLetter } from './news-letter';

describe('NewsLetter', () => {
  let component: NewsLetter;
  let fixture: ComponentFixture<NewsLetter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsLetter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsLetter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
