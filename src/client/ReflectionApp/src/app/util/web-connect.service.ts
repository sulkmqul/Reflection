import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http'
import { Observable, first, firstValueFrom } from 'rxjs';
import {AppConfigService} from './app-config.service';
/**
 * 汎用WEB通信クラス
 */
@Injectable({
  providedIn: 'root'
})
export class WebConnectService {


  constructor(
    private http:HttpClient,
    private config:AppConfigService
  ) { }

  /**
   * get要求を行う
   * @param upath 要求APIパス
   * @param hdic ヘッダーパラメータ{key:value...}
   * @param paramdic 要求パラメータ{key:value...}
   * @returns 
   */
  public getWeb<T>(upath: string, hdic:{[name:string]:string}, paramdic: {[name:string]:string}): Promise<T> {    
    // APIパスの作成
    const url = this.config.ApiUri + upath;

    // 要求パラメータの作成
    let htpa = new HttpParams()          
    for(const pkey of Object.keys(paramdic)){
      htpa = htpa.append(pkey, paramdic[pkey]);
    }
    

    // ヘッダーパラメータの作成
    let header = new HttpHeaders();    
    for(const hkey of Object.keys(hdic)){
      header = header.append(hkey, hdic[hkey]);
    }
    
    let obs = this.http.get<T>(url+ '?' + htpa.toString(), {withCredentials:true, headers:header});    
    return firstValueFrom(obs)
  }


  /**
   * post要求を行う
   * @param upath 要求APIパス
   * @param hdic ヘッダーパラメータ
   * @param body 送信body
   * @returns 
   */
  public postWeb<T>(upath: string, hdic:{[name:string]:string}, body: any): Promise<T> {    
    // APIパスの作成
    const url = this.config.ApiUri + upath;

    // ヘッダーパラメータの作成
    let header = new HttpHeaders();
    for(const hkey of Object.keys(hdic)){
      header = header.append(hkey, hdic[hkey]);
    }
    
    let obs = this.http.post<T>(url, body, {withCredentials:true, headers:header});
    return firstValueFrom(obs);
  }
}
