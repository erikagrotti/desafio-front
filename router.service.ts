// router.service.ts (crie este arquivo)
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterService {
  constructor(private router: Router) {}

  getRouter(): Router {
    return this.router;
  }
}