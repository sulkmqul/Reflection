import { Injectable } from '@angular/core';
import {MsUser} from "./reflect-type";
import { HttpErrorResponse, HttpResponseBase } from '@angular/common/http';

/**
 * 汎用データサービス
 */
@Injectable({
  providedIn: 'root'
})
export class ReflectCommonService {

  constructor() { }


  /**
   * ログインユーザー
   */
  public loginUser : MsUser | null = new MsUser();

  /**
   *エラーメッセージ
   */
  public lastErrorMessage: string = "";


  /**
   * ログイン処理
   * @param user 
   */
  public loginProc(user:MsUser):boolean { 
    this.loginUser = user;   
    return true;
  }

  /**
   * エラーメッセージの設定
   * @param mes メッセージ
   * @param resp レスポンス
   */
  public setLastErrorMessage(mes:string, resp:any)　{
    this.lastErrorMessage = `${mes}`;
    if( resp instanceof HttpResponseBase){
      this.lastErrorMessage = `${mes}:${resp.status}`;
    }
  }
}
