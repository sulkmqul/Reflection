import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditColumnsInfoDialogComponent } from './edit-columns-info-dialog.component';

describe('EditColumnsInfoDialogComponent', () => {
  let component: EditColumnsInfoDialogComponent;
  let fixture: ComponentFixture<EditColumnsInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditColumnsInfoDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditColumnsInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
