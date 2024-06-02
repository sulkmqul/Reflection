import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColTypeInputComponent } from './col-type-input.component';

describe('ColTypeInputComponent', () => {
  let component: ColTypeInputComponent;
  let fixture: ComponentFixture<ColTypeInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColTypeInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ColTypeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
