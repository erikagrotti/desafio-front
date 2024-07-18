import { Injectable } from '@angular/core';
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
  ISignUpResult,
  CognitoRefreshToken
} from 'amazon-cognito-identity-js';
import { environment } from '../src/environments/environments.prod';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userPool: CognitoUserPool;
  private cognitoUser: CognitoUser | null = null;
  private authSubject = new Subject<boolean>(); // Crie o Subject
  authStatus$ = this.authSubject.asObservable(); // Crie o Observable
  // private lambdaEndpoint = environment.aws.urlLambda; // URL do seu Lambda

  constructor(private router: Router, private http: HttpClient) {
    const poolData = {
      UserPoolId: environment.aws.userPoolId,
      ClientId: environment.aws.clientId,
    };
    this.userPool = new CognitoUserPool(poolData);

    // Mova esta linha para dentro do construtor
    this.authSubject.next(this.isAuthenticated()); 
  }

  signIn(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password
      });
  
      const userData = {
        Username: email,
        Pool: this.userPool
      };
  
      this.cognitoUser = new CognitoUser(userData); 
  
      this.cognitoUser.authenticateUser(authenticationDetails, { 
        onSuccess: (result) => {
          // console.log(result)
          this.storeSession(result.getAccessToken().getJwtToken());
          this.router.navigate(['/main']);
          this.authSubject.next(true); // Emitir novo estado após login
          resolve();
        },
        onFailure: (err) => {
          console.error('Erro no login:', err);
          reject(err);
        }
      });
    });
  }

  signUp(email: string, password: string): Promise<ISignUpResult> {
    const attributeList: CognitoUserAttribute[] = [];
    const dataEmail = {
      Name: 'email',
      Value: email
    };
    const attributeEmail = new CognitoUserAttribute(dataEmail);

    attributeList.push(attributeEmail);

    return new Promise((resolve, reject) => {
      this.userPool.signUp(email, password, attributeList, [], (err, result) => {
        if (err) {
          console.error('Erro no cadastro:', err);
          reject(err);
        } else {
          if (result) {
            resolve(result);
          } else {
            reject(new Error("Signup result is undefined"));
          }
        }
      });
    });
  }

  confirmSignUp(email: string, code: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const cognitoUser = this.cognitoUser || new CognitoUser({
        Username: email,
        Pool: this.userPool
      });
  
      cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) {
          console.error('Erro ao confirmar o cadastro:', err);
          reject(err);
          return;
        }
        console.log('Cadastro confirmado com sucesso:', result);
        this.cognitoUser = cognitoUser;
        resolve();
        console.log('Redirecionando para a tela de login...');
        this.router.navigate(['/login']).then(success => {
          if (success) {
            console.log('Navegação para /login bem-sucedida.');
          } else {
            console.error('Navegação para /login falhou.');
          }
        }).catch((error) => {
          console.error('Erro ao redirecionar:', error);
        });
      });
    });
  }

  resendVerificationCode(email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const cognitoUser = this.cognitoUser || new CognitoUser({
        Username: email,
        Pool: this.userPool
      });
  
      cognitoUser.resendConfirmationCode((err, result) => {
        if (err) {
          console.error('Erro ao reenviar código de verificação:', err);
          reject(err);
        } else {
          console.log('Código de verificação reenviado com sucesso:', result);
          resolve(); // Resolve a promessa
        }
      });
    });
  }

  private storeSession(authResult: any): void {
    // const accessToken = authResult.accessToken.jwtToken;
    // const idToken = authResult.idToken.jwtToken;
    // const refreshToken = authResult.refreshToken.jwtToken;
    // localStorage.setItem('accessToken', accessToken);
    // localStorage.setItem('idToken', idToken);
    // localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem("accessToken", authResult)
  }

  
  getAccessToken(): string | null {
    const accessToken = localStorage.getItem('accessToken');

    return accessToken;
  }

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }

  signOut(): void {
    console.log("Cheguei");
    const currentUser = this.userPool.getCurrentUser();

    if (currentUser) {
      console.log("IF");
      currentUser.signOut();
      this.router.navigate(['/login']);
      localStorage.removeItem('accessToken');
      console.log('Usuário deslogado com sucesso!');
      window.location.reload();
      this.authSubject.next(false); // Emita o novo estado de autenticação (false para deslogado)
    } else {
      console.warn('Nenhum usuário cognito encontrado');
    }
  }
}