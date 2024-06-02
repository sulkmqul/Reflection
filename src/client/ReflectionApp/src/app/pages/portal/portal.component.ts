import { Component, ElementRef, ViewChild } from '@angular/core';
import { ReflectWebService } from '../../lib/reflect-web.service';
import { MatProgressBar, MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppConfigService } from '../../util/app-config.service';
import {PortalHeaderComponent} from '../../parts/portal-header/portal-header.component'

@Component({
  selector: 'app-portal',
  standalone: true,
  imports: [MatProgressBarModule, CommonModule, FormsModule, PortalHeaderComponent],
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.css'
})
export class PortalComponent {

  public  constructor(
    private webSvc: ReflectWebService,
    private config:AppConfigService
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

  /**
   * 分割アップロードする
   * @returns
   */
  async onUploadMultiButtonClick(){
    if(this.fileInputControl?.nativeElement.files.length <= 0){
      console.log("no files return");
      return;
    }

    //ファイル情報の取得
    const filedata:File = this.fileInputControl?.nativeElement.files[0];

    
    const fst = filedata.stream().getReader({mode:"byob"});
    
    //上限サイズを決めておく
    const maxdev = this.config.MaxUploadDevSize;
    let count = 0;
    
    while(true){      
      console.log("LoopSTART", count, maxdev);
      
      let rbuf = new Uint8Array(maxdev);      
      const abc = await fst.read(rbuf);
      if(abc.value){        
        console.log("after", abc, rbuf, (abc.value.length / 1024));
      }
      if(abc.done == true){
        console.log("loopbreak");
        break;
      }      
      count++;
    }
    console.log("loopcount", count);
  }


  /**
   * 一括アップロードする
   * @returns 
   */
  async onUploadButtonClick(){
    
    if(this.fileInputControl?.nativeElement.files.length <= 0){
      console.log("no files return");
      return;
    }

    try{

      console.log("start upload", this.fileInputControl?.nativeElement.files);
      let fdata = new FormData();
      for(let i=0; i<this.fileInputControl?.nativeElement.files.length; i++){
        fdata.append("file", this.fileInputControl?.nativeElement.files[i]);
      }

      fdata.append("data", "masakari katsuida kintaro");
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
