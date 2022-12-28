import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadlightsComponent } from './headlights.component';

describe('HeadlightsComponent', () => {
  let component: HeadlightsComponent;
  let fixture: ComponentFixture<HeadlightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadlightsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
