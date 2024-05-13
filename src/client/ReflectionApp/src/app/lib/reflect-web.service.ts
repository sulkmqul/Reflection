import { Injectable, numberAttribute } from '@angular/core';
import {ProgressInfo, WebConnectService} from "../util/web-connect.service"
import { UserInfo, MsListInfoColumns, ReflectResponse } from './reflect-type';
import { Observable, firstValueFrom } from 'rxjs';
import { HttpBackend, HttpEvent, HttpEventType } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class ReflectWebService {

  constructor(private webSvc:WebConnectService) { 
    
  }

  /**
   * 保存認証token名
   */
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

  /**
   * 情報カラムの取得
   */
  public async get_info_col_list() : Promise<MsListInfoColumns[]> {    
    return this.getWebAuth<MsListInfoColumns[]>("admin/get_info_col_list", {}, {});
  }

  /**
   * 情報カラムの追加、更新
   * @param infolist 編集情報
   * @returns 成功可否
   */
  public async commit_info_col(infolist: MsListInfoColumns[]): Promise<boolean> {
    const resp = await this.postWebAuth<ReflectResponse>("admin/commit_info_col", {}, infolist);
    return (resp.code == ReflectResponse.CODE_OK);
  }

  /**
   * 管理情報の削除
   * @param infolist 
   * @returns 
   */
  public async delete_info_col(infolist: MsListInfoColumns[]): Promise<boolean> {
    const resp = await this.postWebAuth<ReflectResponse>("admin/delete_info_col", {}, infolist);
    return (resp.code == ReflectResponse.CODE_OK);
  }

  
  public refUpload(data:FormData): Observable<ProgressInfo<number>> {    
    return this.webSvc.postWebWithProgress<number>("api/refupload", {}, data);    
  }
  public refUploadmuti(data:FormData): Observable<ProgressInfo<number>> {    
    return this.webSvc.postWebWithProgress<number>("api/refuploadmulti", {"Content-Type":"application/octet-stream"}, data);    
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
