import { Component } from '@angular/core';
import { DefauldLoginLayoutComponent } from '../defauld-login-layout/defauld-login-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../primary-input/primary-input.component';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr'; // Importe o ToastrService
// import { AuthService } from '../../../auth.service';

interface LoginForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    DefauldLoginLayoutComponent, 
    ReactiveFormsModule,
    PrimaryInputComponent,
  ],
  providers: [
    // AuthService
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: FormGroup<LoginForm>;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService, // Injete o ToastrService
    // private authService: AuthService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }
}
  // submit() {
  //   if (this.loginForm.invalid) {
  //     return;
  //   }
    
  //   const email = this.loginForm.value.email ?? '';
  //   const password = this.loginForm.value.password ?? '';

  //   this.authService.signIn(email, password)
  //   .then( result =>{
  //     this.toastService.success("Login feito com sucesso!");
  //     console.log('Login sucessful', result);
  //   })
  //   .catch(err =>{
  //     this.toastService.error("Erro inesperado! Tente novamente mais tarde");
  //     console.log('Login failded', err);
  //   })
  // }

//   navigate() {
//     this.router.navigate(["/signup"]);
//   }
// }
