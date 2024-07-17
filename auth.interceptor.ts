// auth.interceptor.ts 
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';


export const setAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtToken = localStorage.getItem('accessToken');
  const newReq = req.clone({
    headers: req.headers.set("Authorization", `Bearer ${jwtToken}`)
  });
  return next(newReq);
}