import { Component, ElementRef, ViewChild } from '@angular/core';
import { ReflectWebService } from '../../lib/reflect-web.service';
import { MatProgressBar, MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-portal',
  standalone: true,
  imports: [MatProgressBarModule, CommonModule, FormsModule],
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.css'
})
export class PortalComponent {

  public  constructor(
    private webSvc: ReflectWebService,
  ){

  }

  @ViewChild("fileInputControl")
  private fileInputControl:ElementRef|null = null;


  public progress_now = 0;
  public progress_max = 0;
  public progressVisible = false;

  onFileInputChanged(){
    console.log(this.fileInputControl?.nativeElement.files.length);
  }


  async onUploadButtonClick(){
    
    if(this.fileInputControl?.nativeElement.files.length <= 0){
      console.log("no files return");
      return;
    }

    try{

      console.log("start upload")
      let fdata = new FormData()
      fdata.append("file", this.fileInputControl?.nativeElement.files[0]);
      this.progressVisible = true;
      this.webSvc.refUpload(fdata).subscribe({
        next: (x)=>{
          console.log("upload next", x);
          this.progress_now = x.progress;
          this.progress_max = 100;
        },
        error:(err)=>{
          console.log("upload error", err);
          this.progressVisible = false;
        },
        complete:() => {
          console.log("upload complete");
          this.progressVisible = false;
        }
      });

      
    }
    catch(ex){
      console.error("upload return failed", ex);
    }


    /*
    try{

      let fdata = new FormData()
      fdata.append("file", this.fileInputControl?.nativeElement.files[0]);
      ///let data = await this.webSvc.refUpload(this.fileInputControl?.nativeElement.files[0]);
      let data = await this.webSvc.refUpload(fdata);
      console.log("upload return value", data);
    }
    catch(ex){
      console.error("upload return failed", ex);
    }*/
  }

}
