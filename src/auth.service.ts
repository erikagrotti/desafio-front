// // src/app/services/auth.service.ts
// import { Injectable, afterNextRender } from '@angular/core';
// // import { FormControl } from '@angular/forms'; // Importe FormControl
// import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
// import { environment } from '../src/environments/environments.prod';
// import { Router } from '@angular/router'; // Importe o Router

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   private userPool!: CognitoUserPool;

//   constructor(private router: Router) {
//       const poolData = {
//         UserPoolId: environment.aws.userPoolId,
//         ClientId: environment.aws.clientId
//       };
//       this.userPool = new CognitoUserPool(poolData);
//   }

//   signIn(email: string, password: string): Promise<any> { // Remova os FormControl<string | null>
//     const authenticationDetails = new AuthenticationDetails({
//       Username: email,
//       Password: password,
//     });

//     const userData = {
//       Username: email,
//       Pool: this.userPool
//     };

//     const cognitoUser = new CognitoUser(userData);

//     return new Promise((resolve, reject) => {
//       cognitoUser.authenticateUser(authenticationDetails, {
//         onSuccess: (result) => {
//           resolve(result);
//           this.router.navigate(['/dashboard']); // Redireciona para o dashboard após o login
//         },
//         onFailure: (err) => {
//           reject(err);
//         }
//       });
//     });
//   }
// }
