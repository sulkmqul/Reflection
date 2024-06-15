import { Component, OnInit } from '@angular/core';
import {MatTableModule} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";

import {ReflectWebService} from "../../../lib/reflect-web.service";
import {ReflectCommonService} from "../../../lib/reflect-common.service";
import {MsUser} from "../../../lib/reflect-type";
import {UserEditDialogComponent} from "./user-edit-dialog/user-edit-dialog.component";
import { TitleStrategy } from '@angular/router';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {

  constructor(
    private webSvc: ReflectWebService,
    private refSvc:ReflectCommonService,    
    public dialog:MatDialog    
  ){

  }
  

  /**
   * 表示ユーザーリスト
   */
  public  userList: MsUser[] = [];

  /**
   * 選択リスト
   */
  public selectedList = new Set<MsUser>();

  /**
   * 表示のデータ
   */
  public displayData: string[] = ["id", "name", "admin"];


  //--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//
  /**
   * ユーザー一覧の取得
   */
  private async loadUserList() {
    try{
      this.userList = await this.webSvc.get_user_list();    }
    catch(ex){
      console.error(ex);
      this.refSvc.setLastErrorMessage("get userlist failed", ex)

    }
  }


  //--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//
  /**
   * 初期化
   */
  async ngOnInit() {
    await this.loadUserList();
  }

  /**
   * テーブルが選択された時
   * @param row 選択情報
   */
  clickTableRow(row: MsUser): void {
    const f = this.selectedList.has(row);
    if(f == false){
      this.selectedList.add(row);
      return;
    }
    this.selectedList.delete(row);    
  }

  /**
   * ユーザーの追加ボタンが押された時
   */
  clickAddUserButton() {
    const diag = this.dialog.open(UserEditDialogComponent);
    diag.afterClosed().subscribe(async ret => {
      if(ret == true){
        await this.loadUserList();        
      }
    });
  }

  /**
   * ユーザーの削除ボタンが押された時
   */
  async clickRemoveUserButton() {
    try{
      if(this.selectedList.size <= 0){
        return;
      }

      //削除確認
      const f = window.confirm("do you want to remove selected items?")
      if(f == false){
        return;
      }
      
      
      //削除
      await this.webSvc.delete_user([...this.selectedList]);

      //再取得
      await this.loadUserList();
    }
    catch(ex){
      console.error("Error", ex);
      this.refSvc.setLastErrorMessage("delete failed", ex);
    }
    finally{

    }
  }

  /**
   * テーブルがダブルクリックされた時
   * @param user 
   */
  doubleClickTableRow(user:MsUser) {
    const diag = this.dialog.open(UserEditDialogComponent, {data:user});
    diag.afterClosed().subscribe(async ret => {
      if(ret == true){
        await this.loadUserList();        
      }
    });
  }
}
