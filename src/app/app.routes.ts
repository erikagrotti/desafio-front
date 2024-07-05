import { Component, createComponent } from '@angular/core';
import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { SignupComponent } from './component/signup/signup.component';
import { MainComponent } from './component/main/main.component';
// import {CreateTaskListComponent} from './component/create-task-list/create-task-list.component';
import { MainCreatedComponent } from './component/main-created/main-created.component';
import { EmailVerificationComponent } from './component/email-verification/email-verification.component';
import { AuthGuard } from './auth.guard'; // Importe o AuthGuard


export const routes: Routes = [
{
    path: "login",
    component: LoginComponent
},
{
    path: "signup",
    component: SignupComponent
},
{
    path: "main",
    component: MainComponent,
    canActivate: [AuthGuard] // Adicione o AuthGuard aqui
},
{
    path: "created",
    component: MainCreatedComponent,
    canActivate: [AuthGuard] // Adicione o AuthGuard aqui
},
{
    path: "autentification",
    component: EmailVerificationComponent
},
{ path: '', redirectTo: '/main', 
    pathMatch: 'full' 
}
];