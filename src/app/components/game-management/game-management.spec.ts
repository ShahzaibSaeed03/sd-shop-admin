import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameManagement } from './game-management';

describe('GameManagement', () => {
  let component: GameManagement;
  let fixture: ComponentFixture<GameManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
