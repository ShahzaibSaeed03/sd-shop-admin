import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StabilityDashboard } from './stability-dashboard';

describe('StabilityDashboard', () => {
  let component: StabilityDashboard;
  let fixture: ComponentFixture<StabilityDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StabilityDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StabilityDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
