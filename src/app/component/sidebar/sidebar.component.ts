import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewChecked {
  showLink: boolean = true;

  constructor(private router: Router, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.showLink = this.router.url !== '/created'; 
  }

  ngAfterViewChecked() {
    // Verifica a URL e atualiza showLink após a verificação da view
    this.showLink = this.router.url !== '/created';
    this.cdRef.detectChanges();
  }
}