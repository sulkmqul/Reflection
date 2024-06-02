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
    public diag:MatDialogRef<FileEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public rfdata: RfListView|null,
    private webSvc: ReflectWebService,
  ){
    this.srcData = rfdata;

    if(rfdata != null){

      this.titleString = "Edit";
      
      //追記の初期値を入れておく
      const vals = Object.values(rfdata.info)
      let index = 0;
      for(let val of vals) {
        this.defInput[index] = val;
        this.colInput[index] = val;
        index++;
      }

      //ダウンロードリンクの作成
      this.downloadLinkString = this.webSvc.create_downloadlink(rfdata.rf_list_id);
      
    }
  }  

  @ViewChild("fileInputControl")
  private fileInputControl:ElementRef|null = null;
  
  /**
   * 元データ
   */
  private srcData:RfListView|null = null;

  /**
   * 編集可否 true=編集中
   */
  public get editFlag() {
    if(this.srcData == null)
      {
        return false;
      }
      return true;
  }

  /**
   * タイトル文字列
   */
  public titleString = "Create"

  /**
   * ファイル名
   */
  public get fileName() {
    if(this.srcData == null){
      return "";
    }
    return this.srcData.filename
  }

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
  public colList:MsListInfoColumns[]|null = null;

  /**
   * カラム入力
   */
  public colInput:Array<any> = [];


  /**
   * 追加カラム、入力設定値(編集用)
   */
  public defInput:Array<any> = [];

  /**
   * ファイルダウンロードのリンク文字列
   */
  public downloadLinkString = "";


  /**
   * 実行中タスク
   */
  private webTask:Subscription|null = null;
  //--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//

  /**
   * 入力の取得
   * @returns 入力まとめ
   */
  private getInputData(): RfListView {
    
    let ans = new RfListView();
    if(this.srcData != null){
      ans = this.srcData;
    }
    else{
      //新規ならファイルを取得
      const file:File = this.fileInputControl?.nativeElement.files[0];
      if(!file){      
        throw Error("File not selected");
      }
      
      ans.filename = file.name;
    }

    if(this.colList == null){
      //colListがnullな場合、初期化されていないためエラー。
      throw Error("initialize failed");
    }

    //追加入力値の取得
    let i = 0;
    for(let col of this.colList) {
      
      if(!this.colInput[i]){        
        throw Error("invalid input");
      }

      ans.info[col.display_name] = this.colInput[i];
      i++;
    }
    return ans;
  }


  /**
   * 挿入データの作成
   */
  private createInsertData(): FormData {

    const file:File = this.fileInputControl?.nativeElement.files[0];
    if(!file){      
      throw Error("File not selected");
    }

    //入力情報の取得
    const indata:RfListView =this.getInputData();

    const fdata:FormData = new FormData();
    fdata.append("file", file);
    fdata.append("data", JSON.stringify(indata));

    return fdata;

  }

  /**
   * 作成挿入処理
   */
  private createInsertProc(){
    try{

      this.errorMessage = ""
      this.progressVisibled = true;
      
      //新規
      //アップロードデータの作成
      const fidata = this.createInsertData();     

      //upload処理
      this.webTask = this.webSvc.insert_manage_data(fidata).pipe(finalize(()=>{ 
        //最後に終了する。
        this.progressVisibled = false;
        this.webTask = null;        
      })).subscribe({
        next: (x)=>{
          this.progress_now = x.progress;
          this.progress_max = x.total;
        },
        error:(err)=>{
          this.errorMessage = "" + err;
          this.progressVisibled = false;
          this.webTask = null;
        },
        complete:() => {
          this.diag.close(true);
        }
      });
    }
    catch(ex) {
      this.errorMessage = "" + ex;
      this.progressVisibled = false;
    }    
  }

  /**
   * 更新処理
   */
  private async updateProc(){
    try{

      this.errorMessage = ""
      this.progressVisibled = true;
      
      //更新データ作成
      const data =this.getInputData();
      console.log("update", data);

      //更新
      await this.webSvc.update_manage_data(data);

      //更新終了で閉じる
      this.diag.close(true);
      
    }
    catch(ex) {
      this.errorMessage = "" + ex;
      this.progressVisibled = false;
    }
    finally{
      this.progressVisibled = false;      
    }
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
      this.errorMessage = "initialize failed";
    }

  }

  /**
   * ファイルの入力が変更された時
   */
  onFileInputChanged(){
    //const file:File = this.fileInputControl?.nativeElement.files[0];    
  }

  /**
   * OKボタンが押された時
   */
  async clickButtonOK() {   
    if(this.editFlag == true){
      //更新処理
      this.updateProc();
    }
    else{
      //新規挿入
      this.createInsertProc();
    }
    
  }

  /**
   * 削除ボタンが押された時
   */
  async clickButtonDelete() {

    if(this.srcData == null){
      return;
    }

    //削除確認
    const f = window.confirm("do you want to remove this item?")
    if(f == false){
      return;
    }

    try{

      this.progressVisibled = true;

      await this.webSvc.delete_manage_data(this.srcData);
    }
    catch(ex){
      this.errorMessage = "" + ex;
      this.progressVisibled = false;
      return;
    }

    //削除確認、削除処理
    this.diag.close(true);
  }
  
  /**
   * ファイルダウンロードボタンが押された時
   */
  /*
  //問題が多かったのでlinkを作成してブラウザの機能でダウンロードさせる
  async clickButtonDownload() {

    if(this.srcData == null){
      return;
    }

    
    this.errorMessage = "";
    this.progressVisibled = true;

    let filename = this.srcData.filename;
    let body:Blob|null = null;

    
    this.webTask = this.webSvc.download_manage_file_progress(this.srcData.rf_list_id).pipe(finalize(()=>{ 

      //最後に終了する。
      this.progressVisibled = false;
      this.webTask = null; 
      
      })).subscribe({
        next: (x)=>{
          this.progress_now = x.progress;
          this.progress_max = x.total;
          
          if(x.resp != null){
            body = x.resp;
          }

        },
        error:(err)=>{
          this.errorMessage = "" + err;
          this.progressVisibled = false;
          this.webTask = null;
        },
        complete:() => {
          if(body == null){
            this.errorMessage = "fdsaf";
            return;
          }

          
          
          const url = window.URL.createObjectURL(body);
          
          let title = filename;

          
          
          //ブラウザの機能でダウンロードしたいので小細工をする。
          let a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display: none');
          a.href = url;
          a.download = title;
          a.click();
          window.URL.revokeObjectURL(url);
          

        }
      });;
  }*/

  /**
   * アップロードのキャンセルボタンが押された時
   */
  clickButtonCancelUpload() {
    this.webTask?.unsubscribe();
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
