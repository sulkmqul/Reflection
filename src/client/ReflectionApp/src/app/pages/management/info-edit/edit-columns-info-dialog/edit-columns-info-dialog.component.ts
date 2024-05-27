import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MsListInfoColumns, ListInfoColumnsType} from "../../../../lib/reflect-type";
import {IntegerInputDirective} from "../../../../util/integer-input.directive";
import { ReflectWebService } from '../../../../lib/reflect-web.service';


@Component({
  selector: 'app-edit-columns-info-dialog',
  standalone: true,
  imports: [FormsModule, IntegerInputDirective, MatProgressBarModule, CommonModule],
  templateUrl: './edit-columns-info-dialog.component.html',
  styleUrl: './edit-columns-info-dialog.component.css'
})
export class EditColumnsInfoDialogComponent {
  
  constructor(
    public diag:MatDialogRef<EditColumnsInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public info: MsListInfoColumns|null,
    private webSvc:ReflectWebService
  ) {
    console.log("Dialog DATA", info);

    this.title = "新規登録";

    //編集時の処理
    if(info != null){
      
      this.title = "編集";

      //編集時は型の変更を許可しない
      this.typeArray = [info.column_type];      
      this.disp_name = info.display_name;
      this.col_type = info.column_type;
      this.default_value = info.default_value;
      this.sort_order = info.sort_order.toString();
      this.visible_flag = (info.visible_flag == 1);

      
    }
  }


  /**
   * 表示タイトル
   */
  public title: string = "";

  public disp_name: string = "";
  public col_type: string = "INTEGER";
  public default_value:string = "";
  public sort_order:string = "";
  public visible_flag:boolean = true;

  /**
   * 進捗プログレスの表示可否
   */
  public progressVisibled: boolean = false;

  /**
   * エラー文字列
   */
  public errorMessage:string = "";

  /**
   * 利用できる型定義
   */
  public typeArray = [
    ListInfoColumnsType.INT,
    ListInfoColumnsType.REAL,
    ListInfoColumnsType.TEXT
  ]

  /**
   * 編集可否
   * true=編集 false=新規
   */
  public get editFlag() : boolean{
    if(this.info == null){
      return false;
    }    
    return true;
  }


  /**
   * 編集情報の作成
   * @returns 
   */
  private createEditData():MsListInfoColumns {

    let ans = new MsListInfoColumns();
    if(this.info != null){
      ans = this.info;
    }

    ans.display_name = this.disp_name.trim();
    if(ans.display_name.length <= 0){
      throw Error("invalid column name");
    }
    ans.column_type = this.col_type;
    ans.default_value = this.default_value;
    ans.sort_order = parseInt(this.sort_order);
    ans.notnull_flag = 1;
    ans.visible_flag = 0;
    if(this.visible_flag == true){
      ans.visible_flag = 1;
    }

    console.log(ans)
    return ans;
  }




  public async clickOkButton() {
    
    //ここで挿入、更新処理
    try{
      this.progressVisibled = true;
      this.errorMessage = "";
      
      //入力からデータの作成
      const data = this.createEditData();
      console.log("input:", data)
      const f = await this.webSvc.commit_info_col([data]);
      if(f == false){
        this.errorMessage = "失敗しました";
        return;
      }      
    }
    catch(ex){
      console.log("listinfo commit exception", ex);
      this.errorMessage = String(ex);
      return;
    }
    finally{
      this.progressVisibled = false;
    }

    //正常終了を通知
    this.diag.close(true);
  }


  

  
}
