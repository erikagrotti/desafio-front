// session-expired-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog'; // Importe MatDialogModule
import { Router } from '@angular/router';
import { RouterService } from '../../../../router.service'; 

@Component({
  selector: 'app-session-expired-dialog',
  templateUrl: './session-expired-dialog.component.html',
  styleUrls: ['./session-expired-dialog.component.scss'],
  standalone: true,
  imports: [MatDialogModule] // Adicione MatDialogModule aqui
})
export class SessionExpiredDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SessionExpiredDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private routerService: RouterService,
  ) {}

  redirectToLogin() {
    if (typeof window !== 'undefined') {
      window.location.href = '/main'
    }
  }
}