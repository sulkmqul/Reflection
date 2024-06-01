import { Component, OnInit } from '@angular/core';
import {PortalHeaderComponent} from '../../parts/portal-header/portal-header.component';
import { ReflectWebService } from '../../lib/reflect-web.service';
import { ReflectCommonService } from '../../lib/reflect-common.service';
import {FileListBoxComponent} from '../../parts/file-list-box/file-list-box.component';
import {ManageListData, MsListInfoColumns, MsUser, RfListView} from "../../lib/reflect-type";
import { MatTableModule } from '@angular/material/table';
import {MatDialog} from "@angular/material/dialog";
import { CommonModule } from '@angular/common';
import {FileEditDialogComponent} from "./file-edit-dialog/file-edit-dialog.component";

@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [MatTableModule, PortalHeaderComponent, FileListBoxComponent, CommonModule],
  templateUrl: './file-list.component.html',
  styleUrl: './file-list.component.css'
})
export class FileListComponent implements OnInit  {
  constructor(
    private webSvc: ReflectWebService,
    private refSvc:ReflectCommonService,
    private dialog:MatDialog
  ){
    
    
  }

  /**
   * 追記表示カラム一覧
   */
  public colList:MsListInfoColumns[] = [];
  /**
   * 管理表示リスト
   */
  public dataList:RfListView[] = [];

  /**
   * 表示一覧
   */
  public displayData: string[] = [];  
  //--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//
  /**
   * テーブル描画項目の作成
   * @returns 
   */
  private createDislayRowsList() {
    const ans = ["id", "name", "update_user", "update_date"];
    this.colList.forEach(x => ans.push(x.display_name));    
    return ans;
  }

  /**
   * テーブル一覧の読み込み
   */
  private async loadList() {
    const data = await this.webSvc.get_list();    
    this.colList = data.colist;
    this.displayData = this.createDislayRowsList();
    this.dataList = data.datalist;
  }
  //--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//
  /**
   * 読み込まれた時
   */
  async ngOnInit() {    
    await this.loadList();

  }

  /**
   * リストが選択された時
   * @param row 
   */
  doubleClickRow(row: RfListView) {

    console.log("dblclick", row);

    const diag = this.dialog.open(FileEditDialogComponent, {data:row});
    
    //閉じたとき
    diag.afterClosed().subscribe(async ret => {
      if(ret == true){
        await this.loadList()
      }
    });
  }


  /**
   * 追加ボタンが押された時
   */
  clickAddButton(){
    const diag = this.dialog.open(FileEditDialogComponent);
    
    //閉じたとき
    diag.afterClosed().subscribe(async ret => {
      if(ret == true){
        await this.loadList()
      }
    });
  }


  

  

}
