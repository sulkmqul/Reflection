import { Injectable } from '@angular/core';
import {WebConnectService} from "../util/web-connect.service"
import { UserInfo } from './reflect-type';



@Injectable({
  providedIn: 'root'
})
export class ReflectWebService {

  constructor(private webSvc:WebConnectService) { 
    
  }

  private static AUTH_SESSION_KEY = "ref_auth_key";

  /**
   * ログイン処理
   * @param login_id ログインID
   * @param login_password パスワード
   * @returns ユーザー情報
   */
  public async login(login_id:string, login_password:string): Promise<UserInfo>{

    //let m = new Promise(rev => setTimeout(rev, 1000));
    //await m;
    let user = await this.webSvc.getWeb<any>("auth/login", {}, {"login_id":login_id, "login_password": login_password});
    
    //認証tokenの保存を行う
    let token = user["auth_token"];
    sessionStorage.setItem(ReflectWebService.AUTH_SESSION_KEY, token);

    let ans = new UserInfo();
    ans.UserID = user["ms_user_id"];
    ans.UserName = user["user_name"];
    console.log("ans", ans);
    return ans;
  }

  //--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//
  /**
   * 認証付きget要求
   * @param upath 
   * @param hdic 
   * @param paramdic 
   * @returns 
   */
  private getWebAuth<T>(upath: string, hdic:{[name:string]:string}, paramdic: {[name:string]:string}): Promise<T> {    

    //認証トークンを要求ヘッダーに追加
    const token = sessionStorage.getItem(ReflectWebService.AUTH_SESSION_KEY);
    if(token != null){
      hdic["reflect-token"] = token;
    }
    
    return this.webSvc.getWeb<T>(upath, hdic, paramdic);
  } 

  /**
   * 認証付きpost要求
   * @param upath 
   * @param hdic 
   * @param body 
   * @returns 
   */
  private postWebAuth<T>(upath: string, hdic:{[name:string]:string}, body:any): Promise<T> {    

    //認証トークンを要求ヘッダーに追加
    const token = sessionStorage.getItem(ReflectWebService.AUTH_SESSION_KEY);
    if(token != null){
      hdic["reflect-token"] = token;
    }
    
    return this.webSvc.postWeb<T>(upath, hdic, body);
  }
}
