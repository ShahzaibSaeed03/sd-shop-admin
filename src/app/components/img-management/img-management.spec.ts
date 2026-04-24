import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgManagement } from './img-management';

describe('ImgManagement', () => {
  let component: ImgManagement;
  let fixture: ComponentFixture<ImgManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImgManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImgManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
