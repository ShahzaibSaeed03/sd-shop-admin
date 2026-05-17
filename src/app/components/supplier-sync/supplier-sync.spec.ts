import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierSync } from './supplier-sync';

describe('SupplierSync', () => {
  let component: SupplierSync;
  let fixture: ComponentFixture<SupplierSync>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierSync]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierSync);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
