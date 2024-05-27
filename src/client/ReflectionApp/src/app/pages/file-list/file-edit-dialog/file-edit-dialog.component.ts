import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormsModule, NgSelectOption} from "@angular/forms";
import {CommonModule, NumberSymbol} from "@angular/common";
import { ReflectWebService } from '../../../lib/reflect-web.service';
import { MsListInfoColumns, RfListView } from '../../../lib/reflect-type';
import { ColTypeInputComponent } from "../../../parts/col-type-input/col-type-input.component";
import { Subscribable, Subscription, finalize } from 'rxjs';

@Component({
    selector: 'app-file-edit-dialog',
    standalone: true,
    templateUrl: './file-edit-dialog.component.html',
    styleUrl: './file-edit-dialog.component.css',
    imports: [MatCardModule, MatProgressBarModule, CommonModule, FormsModule, ColTypeInputComponent]
})
export class FileEditDialogComponent implements OnInit {

  constructor(
    private webSvc: ReflectWebService,
    @Inject(MAT_DIALOG_DATA) public rfdata: RfListView|null,
  ){
    
  }  

  @ViewChild("fileInputControl")
  private fileInputControl:ElementRef|null = null;
  
  /**
   * 編集可否 true=編集中
   */
  public editFlag = true;

  /**
   * タイトル文字列
   */
  public titleString = "新規作成"

  /**
   * 進捗バー表示可否
   */
  public progressVisibled = false;
  /**
   * 進捗バー現在値
   */
  public progress_now = 0;
  /**
   * 進捗バー最大値
   */
  public progress_max = 0;


  /**
   * エラー表示
   */
  public errorMessage = "";


  /**
   * カラム一覧
   */
  public colList:MsListInfoColumns[] = [];

  /**
   * カラム入力
   */
  public colInput:Array<any> = [];

  /**
   * ファイルサイズ
   */
  public fileSize=0;


  /**
   * アップロード中タスク
   */
  private uploadTask:Subscription|null = null;
  //--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//

  /**
   * 入力の取得
   * @returns にゅうりょくまとめ
   */
  private getInputData(): RfListView {
    const file:File = this.fileInputControl?.nativeElement.files[0];
    if(!file){      
      throw Error("ファイルが選択されていません");
    }
    
    const ans = new RfListView();
    ans.filename = file.name;

    //追加入力値の取得
    let i = 0;
    for(let col of this.colList) {
      if(!this.colInput[i]){
        throw Error("入力に問題があります");        
      }

      ans.info[col.display_name] = this.colInput[i];
      i++;
    }
    return ans;
  }


  /**
   * アップロードするデータの作成
   */
  private createUploadData(): FormData {

    const file:File = this.fileInputControl?.nativeElement.files[0];
    if(!file){      
      throw Error("ファイルが選択されていません");
    }

    //入力情報の取得
    const indata:RfListView =this.getInputData();

    const fdata:FormData = new FormData();
    fdata.append("file", file);
    fdata.append("data", JSON.stringify(indata));

    return fdata;

  }
  //--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//
  /**
   * 初期化
   */
  async ngOnInit() {
    try{
      //カラムの一覧取得
      this.colList = await this.webSvc.get_info_col_list();      
      this.colInput = new Array<any>(this.colList.length);
    }
    catch(ex) {
      this.errorMessage = "初期化失敗";
    }
  }

  /**
   * ファイルの入力が変更された時
   */
  onFileInputChanged(){

    const file:File = this.fileInputControl?.nativeElement.files[0];
    if(!file){
      this.fileSize = 0;
      return;
    }
    this.fileSize = file.size;
  }

  /**
   * OKボタンが押された時
   */
  async clickButtonOK() {   
    
    try{
      
      this.errorMessage = ""
      this.progressVisibled = true;
      
      
      //アップロードデータの作成
      const fidata = this.createUploadData();
      

      //upload処理
      this.uploadTask = this.webSvc.insert_manage_data(fidata).pipe(finalize(()=>{ 
        //最後に終了する。
        this.progressVisibled = false;
        this.uploadTask = null;        
      })).subscribe({
        next: (x)=>{
          this.progress_now = x.progress;
          this.progress_max = x.total;
        },
        error:(err)=>{
          this.errorMessage = "" + err;
          this.progressVisibled = false;
          this.uploadTask = null;
        },
        complete:() => {          
        }
      });
      
    }
    catch(ex) {
      this.errorMessage = "" + ex;
      this.progressVisibled = false;
    }
  }

  /**
   * 削除ボタンが押された時
   */
  clickButtonODelete() {
    //削除確認、削除処理
    
  }

  clickButtonCancelUpload() {
    this.uploadTask?.unsubscribe();
  }

  /**
   * 追加情報の入力が変更された時
   * @param value 入力値
   * @param index カラムindex
   */
  colInputEvent(value:any, index:number) {
    //入力値を保存
    this.colInput[index] = value;
  }

}
