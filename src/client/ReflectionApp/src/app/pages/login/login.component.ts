import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router"
import {CommonModule} from "@angular/common";
import {ReflectWebService} from "../../lib/reflect-web.service";
import {ReflectCommonService} from "../../lib/reflect-common.service";
import {AppConfigService} from "../../util/app-config.service";
import {MatCardModule} from "@angular/material/card"
import {MatProgressBarModule} from "@angular/material/progress-bar"

/**
 * ログインページ
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatProgressBarModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(
    private webSvc: ReflectWebService,
    public config:AppConfigService,
    private refSvc:ReflectCommonService,
    private router:Router
  ) {

  }

  /**
   * 入力ログインID
   */
  //public inputLoginID: string = "admin";
  public inputLoginID: string = "";
  /**
   * 入力パスワード
   */
  //public inputLoginPassword: string = "#reflection";
  public inputLoginPassword: string = "";

  /**
   * エラー文字列
   */
  public errorMessage:string = "";

  /**
   * 進捗表示可否
   */
  public progressVisibled = false;

  //--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//
  /**
   * ログインボタンが押された時
   */
  async onClickLoginButton() {
    try{

      //ログイン前初期化
      this.progressVisibled = true;
      this.errorMessage = "";

      //ログイン問い合わせ
      let user = await this.webSvc.login(this.inputLoginID, this.inputLoginPassword);
      if(user == null)
      {
        throw Error("user null");
      }

      //ログイン処理
      let f = this.refSvc.loginProc(user);
      if(f ==false)
      {
        throw Error("login proc failed");
      }

      //画面遷移
      this.router.navigate(["flist"]);

    }
    catch(ex)
    {
      console.error(ex);
      this.errorMessage = "login failed";
    }
    finally
    {
      this.progressVisibled = false;
    }
  }

}
