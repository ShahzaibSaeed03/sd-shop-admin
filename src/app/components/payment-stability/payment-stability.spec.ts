import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentStability } from './payment-stability';

describe('PaymentStability', () => {
  let component: PaymentStability;
  let fixture: ComponentFixture<PaymentStability>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentStability]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentStability);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
