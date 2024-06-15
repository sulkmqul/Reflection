import { Component, EventEmitter, Input, Output } from '@angular/core';
import {ListInfoColumnsType, MsListInfoColumns} from "../../lib/reflect-type";
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-col-type-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './col-type-input.component.html',
  styleUrl: './col-type-input.component.css'
})
export class ColTypeInputComponent {
  constructor(){

  }

  @Input()
  colData:MsListInfoColumns|null = null;


  @Output()
  value = new EventEmitter();



  /**
   * 入力値
   */  
  public inputText: string = "";

  /**
   * 初期値
   */
  @Input()
  public set initialValue(va:any) {
    if(!va){
      return;
    }
    this.inputText = String(va);

    //流し込まれたら編集として処理する
    this.changeInput()
  }
  //--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//
  /**
   * 入力が変更されたとｋ
   */
  changeInput(){
    if(this.colData == null){
      return;
    }
    //入力値の取得
    let ans = null;

    //型に応じて加工
    switch(this.colData.column_type)
    {
      case ListInfoColumnsType.INT:
        ans = Number.parseInt(this.inputText);
        if(!ans){
          //nanはnullとして処理
          ans = null;
        }
        break;
      case ListInfoColumnsType.REAL:
        ans = Number.parseFloat(this.inputText);
        if(!ans){
          //nanはnullとして処理
          ans = null;
        }
        break;
      case ListInfoColumnsType.TEXT:
        ans = this.inputText;
        break;
    }
    this.value.emit(ans);
  }

  
  
}
