import { Directive, ElementRef, Host, HostListener } from '@angular/core';

@Directive({
  selector: '[appIntegerInput]',
  standalone: true
})
export class IntegerInputDirective {

  constructor(
    private elem: ElementRef<HTMLInputElement>
  ) { 

  }


  @HostListener("input")
  onInputProc() {
    const val = this.elem.nativeElement.value;
    this.elem.nativeElement.value = val.replace(RegExp("[^0-9]+"), "");
    
  }

}
