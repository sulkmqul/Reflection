import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders, HttpEvent, HttpRequest, HttpEventType} from '@angular/common/http'
import { Observable, Observer, every, filter, firstValueFrom, map } from 'rxjs';
import {AppConfigService} from './app-config.service';

/**
 * 進捗情報
 */
export class ProgressInfo<T> {

  constructor(lo:number, to:number, data:T|null = null){
    this._loaded = lo;
    this._total = to;
    this._complete = false;
    if(data != null){
      this._complete = true;
      this._resp = data;
    }
    
  }

  /**
   * 終了可否
   */
  private _complete : boolean = false;
  /**
   * 現在値
   */
  private _loaded : number = 0;
  /**
   * 全体
   */
  private _total : number = 0;  
  /**
   * 応答値
   */
  private _resp : T|null = null;


  public get complete() { return this._complete }
  public get loaded() { return this._loaded }
  public get total() { return this._total }
  public get resp() { return this._resp }

  /**
   * 進捗率の取得
   */
  public get progress() : number {
    if(this.total == 0){
      return 0;
    }
    const prog = (this.loaded / this.total) * 100;
    return prog;
  }
};

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
    
    const obs = this.http.get<T>(url+ '?' + htpa.toString(), {withCredentials:true, headers:header});    
    return firstValueFrom<T>(obs)
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
    
    const obs = this.http.post<T>(url, body, {withCredentials:true, headers:header});
    return firstValueFrom(obs);
  }

  /**
   * 進捗報告付post要求
   * @param upath 要求アドレス
   * @param hdic ヘッダー
   * @param body body
   * @returns 
   */
  public postWebWithProgress<T>(upath: string, hdic:{[name:string]:string}, body: any): Observable<ProgressInfo<T>> {

    // ヘッダーパラメータの作成
    let header = new HttpHeaders();
    for(const hkey of Object.keys(hdic)){
      header = header.append(hkey, hdic[hkey]);
    }

    const url = this.config.ApiUri + upath;
    const hreq = new HttpRequest("POST", url, body, {
      reportProgress: true,
      headers:header
    });

    //リスエストを投げる
    const req = this.http.request(hreq);

    //httpeventを扱いやすくする。
    return req.pipe(
      //filter(x => x.type == HttpEventType.Response || x.type == HttpEventType.UploadProgress),
      map(x => {        
        const a = this.procPostProgressNext<T>(x);
        return a;
      })
    );
    
    /*
    const pob = new Observable<ProgressInfo<T>>(obs =>{
      //捕まえて扱いやすい形式に変換する
      req.subscribe({
        next: (x)=>{               
          const prog = this.procPostProgressNext<T>(x);
          if(prog != null){
            obs.next(prog);
          }
        },
        error:(err)=>{  
          obs.error(err);
        },
        complete:() => {
          obs.complete();
        }
      });            
    });
    return pob;*/
  }

  /**
   * 進捗処理
   * @param ev イベント
   * @returns 今回の進捗情報
   */
  private procPostProgressNext<T>(ev : HttpEvent<any>) : ProgressInfo<T> {
    
    let ans:ProgressInfo<T> = new ProgressInfo<T>(0, 0);
    switch(ev.type) {
      //post進捗中
      case HttpEventType.UploadProgress:
        ans = new ProgressInfo<T>(ev.loaded, ev.total ?? 0);
        break;
      
      //responseが帰ってきた
      case HttpEventType.Response:
        ans = new ProgressInfo<T>(0, 0, ev.body);
        break;

      default:
        //throw new Error("unknown http event raise:" + ev.type);
        console.log("unknown event", ev.type);
        ans = new ProgressInfo<T>(0, 0);
        break;
    }
    
    return ans;
  }
}
