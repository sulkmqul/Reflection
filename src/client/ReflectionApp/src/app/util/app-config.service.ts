import { Injectable } from '@angular/core';
import { appConfig } from '../app.config';

/**
 * assets/configと値を揃える
 */
export class ConfigData
{
  /**
   * 
   */
  ApiUri:string = "";

  ApplicationTitle:string = "";
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
  }
}
