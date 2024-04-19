import { Injectable } from '@angular/core';
import {UserInfo} from "./reflect-type";
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
   * ログイン処理
   * @param user 
   */
  public loginProc(user:UserInfo):boolean {    
    return true;
  }
}
