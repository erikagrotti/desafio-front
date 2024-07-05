import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CreateTaskListComponent } from '../create-task-list/create-task-list.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-created',
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    CreateTaskListComponent,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './main-created.component.html',
  styleUrl: './main-created.component.scss'
})
export class MainCreatedComponent implements OnInit {
  showSidebar = true; 

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Controle a visibilidade do sidebar com base na rota
      this.showSidebar = event.urlAfterRedirects !== '/created'; 
    });
  }
}
