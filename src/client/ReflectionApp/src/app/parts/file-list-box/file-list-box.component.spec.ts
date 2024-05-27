import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileListBoxComponent } from './file-list-box.component';

describe('FileListBoxComponent', () => {
  let component: FileListBoxComponent;
  let fixture: ComponentFixture<FileListBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileListBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FileListBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
