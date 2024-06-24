import { Injectable } from '@angular/core';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { environment } from '../src/environments/environments.prod'; // Certifique-se de apontar para o arquivo correto

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private cognito = new CognitoIdentityServiceProvider({
    region: environment.aws.region,
  });

  constructor() {}

  async signIn(email: string, password: string): Promise<void> {
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: environment.aws.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    };

    try {
      const result = await this.cognito.initiateAuth(params).promise();
      console.log('Autenticação bem-sucedida:', result); // Log de sucesso
      // Aqui você pode armazenar tokens em armazenamento local ou sessão, se necessário
    } catch (error: any) {
      console.error('Erro na autenticação:', error); // Log detalhado de erro
      throw error;
    }
  }

  async signUp(email: string, password: string): Promise<void> {
    const params = {
      ClientId: environment.aws.clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email
        }
      ]
    };

    try {
      const result = await this.cognito.signUp(params).promise();
      console.log('Cadastro bem-sucedido:', result); // Log de sucesso
    } catch (error: any) {
      console.error('Erro no cadastro:', error); // Log detalhado de erro
      throw error;
    }
  }
}
