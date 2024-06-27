import { Component, createComponent } from '@angular/core';
import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { SignupComponent } from './component/signup/signup.component';
import { MainComponent } from './component/main/main.component';
import {CreateTaskListComponent} from './component/create-task-list/create-task-list.component'

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
    component: MainComponent
},
{
    path: "created",
    component: CreateTaskListComponent
}
];