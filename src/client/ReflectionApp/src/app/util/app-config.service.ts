import { Injectable } from '@angular/core';
import { appConfig } from '../app.config';

/**
 * assets/configと値を揃える
 */
export class ConfigData
{
  /**接続先URIのアドレス
   * 
   */
  ApiUri:string = "";

  /**
   * アプリケーションのタイトル名
   */
  ApplicationTitle:string = "";

  /**
   * 分割アップロードする場合の一つのデータの最大サイズ
   */
  MaxUploadDevSize : number = 0;

  /**
   * 一括アップロードと分割アップロードの境界サイズ、このサイズを超えた場合、分割アップロードとする。
   */
  MaxUploadSizeForOneTime : number = 0;
}

declare const AppConfig:Partial<ConfigData>;

@Injectable({
  providedIn: 'root'
})
export class AppConfigService extends ConfigData {

  constructor() {
    super();
    this.loadConfig();
  }

  /**
   * 設定値の読み込み
   */
  private loadConfig()
  {
    this.ApplicationTitle = AppConfig.ApplicationTitle ?? "";
    this.ApiUri = AppConfig.ApiUri ?? "";
    this.MaxUploadDevSize = AppConfig.MaxUploadDevSize ?? 1024 * 1024 * 1;
    this.MaxUploadSizeForOneTime = AppConfig.MaxUploadSizeForOneTime ?? 1024 * 1024 * 4;
  }
}
