import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../auth.service';
import { Router, NavigationEnd, Event } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIconModule,
    MatDialogModule,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public showLogoutButton: boolean = false;
  public authService: AuthService;
  private authSubscription: Subscription | undefined;

  constructor(authService: AuthService, private router: Router) {
    this.authService = authService;
  }

  ngOnInit(): void {
    // Inscreva-se no Observable authStatus$
    this.authSubscription = this.authService.authStatus$.subscribe(
      (isAuthenticated: boolean) => {
        // Atualize showLogoutButton com base no status de autenticação e rota
        this.showLogoutButton = isAuthenticated && ['/main', '/created'].includes(this.router.url);
      }
    );

    // Inicialize showLogoutButton com base no estado inicial (após a inscrição)
    this.showLogoutButton = this.authService.isAuthenticated() && ['/main', '/created'].includes(this.router.url); 
  }

  ngOnDestroy(): void {
    // Cancele a inscrição ao destruir o componente para evitar vazamentos de memória
    if (this.authSubscription) { // Verifique se authSubscription existe
      this.authSubscription.unsubscribe(); 
    }
  }

  logout(): void {
    if (confirm('Tem certeza que deseja sair?')) {
      this.authService.signOut();
      this.router.navigate(['/login']);
    }
  }
}