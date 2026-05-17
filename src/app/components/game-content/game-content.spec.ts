import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameContent } from './game-content';

describe('GameContent', () => {
  let component: GameContent;
  let fixture: ComponentFixture<GameContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameContent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameContent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
