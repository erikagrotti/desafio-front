import { HttpInterceptorFn, HttpRequest, HttpHandler, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RouterService } from './router.service'; 
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SessionExpiredDialogComponent } from './src/app/component/session-expired-dialog/session-expired-dialog.component';

export const setAuthInterceptor: HttpInterceptorFn = (req: any, next: any) => {
  const routerService = inject(RouterService);
  const router = routerService.getRouter(); 
  const dialog = inject(MatDialog);
  const jwtToken = localStorage.getItem('accessToken');
  const newReq = req.clone({
    headers: req.headers.set("Authorization", `Bearer ${jwtToken}`)
  });

    return next(newReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          dialog.open(SessionExpiredDialogComponent);
        }
        return EMPTY;
      })
    );
  } 
