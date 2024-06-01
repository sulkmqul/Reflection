import { Injectable, numberAttribute } from '@angular/core';
import {ProgressInfo, WebConnectService} from "../util/web-connect.service"
import { MsUser, MsListInfoColumns, ReflectResponse, MsUserEdit, ManageListData, RfListView } from './reflect-type';
import { Observable, firstValueFrom } from 'rxjs';
import { HttpBackend, HttpEvent, HttpEventType, HttpParams } from '@angular/common/http';



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


  //--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//
  //--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//
  //API
  //--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//
  //--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//
  /**
   * 管理ファイル一覧取得
   * @returns 
   */
  public async get_list(): Promise<ManageListData> {
    return this.getWebAuth<ManageListData>("api/get_list", {}, {});
  }


  /**
   * 管理ファイルへの挿入処理
   * @param fdata 挿入データ
   * @returns 挿入ID
   */
  public insert_manage_data(fdata:FormData): Observable<ProgressInfo<number>> {
    return this.postWebProgressAuth<number>("api/insert_manage_data", {}, fdata);
    
  }

  /**
   * 管理リストの更新
   * @param data 更新データ
   * @returns 成功可否
   */
  public async update_manage_data(data:RfListView): Promise<boolean> {

    const fdata:FormData = new FormData();    
    fdata.append("data", JSON.stringify(data));

    const ret = await this.postWebAuth<ReflectResponse>("api/update_manage_data", {}, fdata);
    if(ret.code == 1){
      return true;
    }
    return false;
  }

  /**
   * 管理データの削除処理
   * @param data 削除データ
   * @returns 
   */
  public async delete_manage_data(data:RfListView): Promise<boolean> {

    const fdata:FormData = new FormData();    
    fdata.append("data", JSON.stringify(data));

    const ret = await this.postWebAuth<ReflectResponse>("api/delete_manage_data", {}, fdata);
    if(ret.code == 1){
      return true;
    }
    return false;
  }

  /**
   * 管理ファイルのダウンロード
   * @param rid rf_list_id
   * @returns 
   */
  public download_manage_file(rid:number) {

    return this.webSvc.fetchWeb("api/download_manage_file", {}, {"rid":rid.toString()});
  }

  /**
   * 進捗付きダウンロード
   * @param rid 
   * @returns 
   */
  public download_manage_file_progress(rid:number) {

    return this.webSvc.getWebWithProgress<Blob>("api/download_manage_file", {}, {"rid":rid.toString()});
  }

  /**
   * ファイルダウンロードのlinkを作成取得する
   * @param rid 
   * @returns 
   */
  public create_downloadlink(rid:number): string {
    let token = sessionStorage.getItem(ReflectWebService.AUTH_SESSION_KEY);
    if(!token){
      token = "";      
    }
    return this.webSvc.createUri("api/download_manage_file_link", {"rid":rid.toString(), "token":token})
  }
  //--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//
  //--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//
  //Auth
  //--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//
  //--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//
  /**
   * ログイン処理
   * @param login_id ログインID
   * @param login_password パスワード
   * @returns ユーザー情報
   */
  public async login(login_id:string, login_password:string): Promise<MsUser>{

    //let m = new Promise(rev => setTimeout(rev, 1000));
    //await m;
    let user = await this.webSvc.getWeb<any>("auth/login", {}, {"login_id":login_id, "login_password": login_password});
    
    //認証tokenの保存を行う
    let token = user["auth_token"];
    sessionStorage.setItem(ReflectWebService.AUTH_SESSION_KEY, token);

    
    const ans = user["user"];
    
    
    return ans;
  }

  //--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//
  //--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//
  //Admin
  //--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//
  //--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//
  /**
   * ユーザー一覧の取得
   * @returns 
   */
  public async get_user_list() : Promise<MsUser[]> {
    return this.getWebAuth("admin/get_user_list", {}, {});
  }


  /**
   * ログインIDの不正チェック
   * @param login_id 確認ID
   * @returns true=問題なし false=問題あり
   */
  public async check_login_id(login_id:string) : Promise<boolean> {
    const ret = await this.getWebAuth<ReflectResponse>("admin/check_login_id", {}, {"login_id": login_id});
    if(ret.code == 1){
      return true;
    }
    return false;
  }

  /**
   * ユーザー挿入
   * @param user 挿入データ
   * @returns 挿入UserID
   */
  public async insert_user(user:MsUserEdit) : Promise<number> {
    const ret = await this.postWebAuth<ReflectResponse>("admin/insert_user", {}, user);
    return ret.code;
  }

  /**
   * ユーザーの更新
   * @param user 更新情報
   * @returns 成功可否
   */
  public async update_user(user:MsUser) : Promise<boolean> {
    const ret = await this.postWebAuth<ReflectResponse>("admin/update_user", {}, user);
    return (ret.code == ReflectResponse.CODE_OK);
  }

  /**
   * ユーザーの削除
   * @param userlist 削除するユーザー一式
   * @returns 成功可否
   */
  public async delete_user(userlist:MsUser[]): Promise<boolean> {
    const ret = await this.postWebAuth<ReflectResponse>("admin/delete_user", {}, userlist);
    return (ret.code == ReflectResponse.CODE_OK);
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

  
  /**
   * 認証付き進捗報告付Post要求
   * @param upath 要求uri
   * @param hdic ヘッダー
   * @param body post内容
   * @returns 
   */
  private postWebProgressAuth<T>(upath: string, hdic:{[name:string]:string}, body:any): Observable<ProgressInfo<T>> {    

    //認証トークンを要求ヘッダーに追加
    const token = sessionStorage.getItem(ReflectWebService.AUTH_SESSION_KEY);
    if(token != null){
      hdic["reflect-token"] = token;
    }
    
    return this.webSvc.postWebWithProgress<T>(upath, hdic, body);
  }
}
