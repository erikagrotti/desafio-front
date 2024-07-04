import { Component } from '@angular/core';
import { AuthService } from '../../../auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})

export class SidebarComponent {

  public authService: AuthService;

  constructor(authService: AuthService, private router: Router) { // Corrija a injeção aqui
    this.authService = authService;
  }

  logout(): void {
    if (confirm('Tem certeza que deseja sair?')) {
      this.router.navigate(['/login']);
      this.authService.signOut();
    }
  }
}