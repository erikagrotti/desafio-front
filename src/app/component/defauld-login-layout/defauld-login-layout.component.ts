import { Component, EventEmitter, Input, Output, input, output } from '@angular/core';

@Component({
  selector: 'app-defauld-login-layout',
  standalone: true,
  imports: [],
  templateUrl: './defauld-login-layout.component.html',
  styleUrl: './defauld-login-layout.component.scss'
})
export class DefauldLoginLayoutComponent {
  @Input() title: string="";
  @Input() 'primaryBtnText': string="";
  @Input() 'secondBtnText': string="";
  @Input() 'disablePrimaryBtn': boolean = true;
  @Output("submit") onSubmit = new EventEmitter();
  @Output("navigate") onNavigate = new EventEmitter();

  submit(){
    this.onSubmit.emit();
  }

  navigate(){
    this.onNavigate.emit();
  }
}
