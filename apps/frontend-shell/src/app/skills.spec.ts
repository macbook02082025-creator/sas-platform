import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkillEditor } from './skills';

describe('SkillEditor', () => {
  let component: SkillEditor;
  let fixture: ComponentFixture<SkillEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillEditor],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillEditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
