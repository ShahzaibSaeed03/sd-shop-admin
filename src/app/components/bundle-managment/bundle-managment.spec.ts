import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BundleManagment } from './bundle-managment';

describe('BundleManagment', () => {
  let component: BundleManagment;
  let fixture: ComponentFixture<BundleManagment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BundleManagment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BundleManagment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
