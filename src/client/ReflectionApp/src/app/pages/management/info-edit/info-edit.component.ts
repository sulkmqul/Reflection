import { Component, OnInit } from '@angular/core';
import {MatTableModule} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";

import {ReflectWebService} from "../../../lib/reflect-web.service";
import {ReflectCommonService} from "../../../lib/reflect-common.service";

import {MsListInfoColumns} from "../../../lib/reflect-type";
import {EditColumnsInfoDialogComponent} from "./edit-columns-info-dialog/edit-columns-info-dialog.component";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-info-edit',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './info-edit.component.html',
  styleUrl: './info-edit.component.css'
})
export class InfoEditComponent implements OnInit {
  constructor(
    private webSvc: ReflectWebService,
    private refSvc:ReflectCommonService,    
    public dialog:MatDialog
  ){

  }

  /**
   * 表示編集テーブルカラム情報
   */
  public  columnsInfoData: MsListInfoColumns[] = [];

  /**
   * 表示のデータ
   */
  public displayData: string[] = ["name", "type", "sort_order", "visibled"];

  /**
   * 現在選択中のデータ
   */
  public selectedDataVec = new Set<MsListInfoColumns>();
  

  //--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//
  /**
   * テーブル情報の再読み込み
   */
  async loadTableInfo() {
    
    try{      
      this.columnsInfoData  = await this.webSvc.get_info_col_list();
    }
    catch(ex:any){
      console.info("Error", ex);
      this.refSvc.setLastErrorMessage("取得失敗", ex);
    }
  }


  /**
   * 削除処理
   */
  async removeSelectedColInfo() {
    try{      
      await this.webSvc.delete_info_col([...this.selectedDataVec]);      
    }
    catch(ex:any){
      console.info("Error", ex);
      this.refSvc.setLastErrorMessage("削除失敗", ex);
    }
  }

  //--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//
  /**
   * componentの初期化
   */
  async ngOnInit() {
    await this.loadTableInfo();    
  }

  /**
   * テーブルが選択されたとき
   * @param row 選択Row
   */
  clickTableRow(row: MsListInfoColumns): void {
    const f = this.selectedDataVec.has(row);
    if(f == false){
      this.selectedDataVec.add(row);
      return;
    }
    this.selectedDataVec.delete(row);    
  }


  /**
   * 追加ボタンが押されたとき
   */
  clickAddInfoButton(){
    //編集ダイアログの表示
    const diag = this.dialog.open(EditColumnsInfoDialogComponent);

    //編集ダイアログが閉じられた
    diag.afterClosed().subscribe(async ret =>{
      if(ret == true){
        //再更新
        await this.loadTableInfo();
      }
    });
  }

  /**
   * 削除ボタンが押されたとき
   */
  async clickRemoveInfoButton(){

    if(this.selectedDataVec.size <= 0){
      return;
    }
    
    //削除確認
    const f = window.confirm("do you want to remove selected items?")
    if(f == false){
      return;
    }

    await this.removeSelectedColInfo();

    await this.loadTableInfo();
    
  }

  /**
   * rowがダブルクリックされたとき
   * @param row 
   */
  doubleClickTable(row:MsListInfoColumns) {    
    //編集ダイアログの表示
    const diag = this.dialog.open(EditColumnsInfoDialogComponent, {
      data:row
    });

    //編集ダイアログが閉じられた
    diag.afterClosed().subscribe(async ret =>{
      if(ret == true){
        //再更新
        await this.loadTableInfo();
      }
    });
  }


}
