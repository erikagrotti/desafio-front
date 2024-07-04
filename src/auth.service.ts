import { Injectable } from '@angular/core';
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
  ISignUpResult
} from 'amazon-cognito-identity-js';
import { environment } from '../src/environments/environments.prod';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userPool: CognitoUserPool;
  private cognitoUser: CognitoUser | null = null;

  constructor(private router: Router) {
    const poolData = {
      UserPoolId: environment.aws.userPoolId,
      ClientId: environment.aws.clientId
    };
    this.userPool = new CognitoUserPool(poolData);
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

      const cognitoUser = new CognitoUser(userData);

      cognitoUser.authenticateUser(authenticationDetails, { 
        onSuccess: (result) => {
          this.storeSession(result);
          this.router.navigate(['/main']);
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
        resolve(); // Resolve a promessa
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
    localStorage.setItem('accessToken', authResult.accessToken.jwtToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }

  signOut(): void {
    if (this.cognitoUser) {
      this.cognitoUser.signOut();
      localStorage.removeItem('accessToken');
      this.router.navigate(['/login']);
    }
  }
}