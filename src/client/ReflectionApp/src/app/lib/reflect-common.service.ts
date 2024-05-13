import { Injectable } from '@angular/core';
import {UserInfo} from "./reflect-type";
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
  public loginUser : UserInfo | null = null;

  /**
   *エラーメッセージ
   */
  public lastErrorMessage: string = "";


  /**
   * ログイン処理
   * @param user 
   */
  public loginProc(user:UserInfo):boolean {    
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
