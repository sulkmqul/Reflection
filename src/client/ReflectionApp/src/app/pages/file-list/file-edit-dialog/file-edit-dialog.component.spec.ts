import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileEditDialogComponent } from './file-edit-dialog.component';

describe('FileEditDialogComponent', () => {
  let component: FileEditDialogComponent;
  let fixture: ComponentFixture<FileEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileEditDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FileEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
