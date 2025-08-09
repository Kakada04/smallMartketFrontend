import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopCategory } from './top-category';

describe('TopCategory', () => {
  let component: TopCategory;
  let fixture: ComponentFixture<TopCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
