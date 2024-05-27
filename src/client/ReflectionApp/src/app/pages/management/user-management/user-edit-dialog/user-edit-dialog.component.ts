import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MsUser, MsUserEdit} from "../../../../lib/reflect-type";
import { ReflectWebService } from '../../../../lib/reflect-web.service';

@Component({
  selector: 'app-user-edit-dialog',
  standalone: true,
  imports: [FormsModule, MatProgressBarModule, CommonModule],
  templateUrl: './user-edit-dialog.component.html',
  styleUrl: './user-edit-dialog.component.css'
})
export class UserEditDialogComponent {

  constructor(
    public diag:MatDialogRef<UserEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public userData: MsUser|null,
    private webSvc:ReflectWebService
  ) {
    this.title = "User add";
    if(userData != null){
      this.title = "User edit";
      this.userName = userData.user_name;
      this.adminFlag = (userData.admin_flag == 1);
    }
  }

  public userName = "";
  public adminFlag = false;
  public loginID = "";
  public loginPassword = "";

  /**
   * 表示タイトル
   */
  public title = "";

  /**
   * 進捗表示可否
   */
  public progressVisibled: boolean = false;

  /**
   * エラーメッセージ
   */
  public errorMessage = "";

  /**
   * 編集可否
   * true=編集 false=新規
   */
  public get editFlag() : boolean{
    if(this.userData == null){
      return false;
    }    
    return true;
  }

  /**
   * ユーザーの挿入処理
   * @returns 成功可否
   */
  private async insertUser() {

    const idata = new MsUserEdit();
    idata.user_name = this.userName.trim();
    idata.admin_flag = (this.adminFlag == true) ? 1 : 0; 
    idata.login_id = this.loginID.trim();
    idata.login_password = this.loginPassword.trim();

    if(idata.user_name.length <= 0){
      throw new Error("no user name input.");
    }
    if(idata.login_id.length <= 0){
      throw new Error("no login-id input.");
    }
    if(idata.login_password.length <= 0){
      throw new Error("no password input.");
    }
    
    //loginIDの確認
    const ck = await this.webSvc.check_login_id(idata.login_id);
    if(ck == false){
      throw new Error("LoginID error");
    }

    //データ挿入
    const r = await this.webSvc.insert_user(idata);


  }

  /**
   * ユーザーの更新処理
   * @returns 成功可否
   */
  private async updateUser() {

    //入力取得
    const idata = this.userData ?? new MsUser();
    idata.user_name = this.userName.trim();
    idata.admin_flag = (this.adminFlag == true) ? 1 : 0;    

    if(idata.user_name.length <= 0){
      throw new Error("no user name input.");
    }

    await this.webSvc.update_user(idata);
  }

  //--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//
  async clickButtonOK(){
    this.progressVisibled = true;
    try{      
      if(this.editFlag == false){
        //挿入
        await this.insertUser();
      }
      else{
        //更新
        await this.updateUser();
      }
    }
    catch(ex){
      console.error("user commit", ex);
      this.errorMessage = String(ex);
      return;
    }
    finally{
      this.progressVisibled = false;
    }
    this.diag.close(true);
  }
}
