import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReflectCommonService} from "../../lib/reflect-common.service";
import { Router } from '@angular/router';
import {AppConfigService} from "../../util/app-config.service";


@Component({
  selector: 'app-portal-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portal-header.component.html',
  styleUrl: './portal-header.component.css'
})
export class PortalHeaderComponent {

  constructor(
    private refSvc:ReflectCommonService,
    private router:Router,
    public config:AppConfigService
  ){
    
  }

  /**
   * ログインユーザー名
   */
  public get loginUserName(): string {
    return this.refSvc.loginUser?.UserName ?? "";
  }

  /**
   * 管理者可否
   */
  public get isManagement(): boolean {
    return this.refSvc.loginUser?.AdminFlag ?? true;    
  }

  /**
   * エラーメッセージ
   */
  public get errorMessage(): string {
    return this.refSvc.lastErrorMessage;
  }

  /**
   * Portalボタンが押された時
   */
  clickPortal() {
    this.router.navigate(["portal"]);
  }

  /**
   * Listボタンが押された時
   */
  clickList() {
    this.router.navigate(["flist"]);
  }

  /**
   * Managementボタンが押された時
   */
  clickManagement(){
    this.router.navigate(["manage"]);
  }

}
