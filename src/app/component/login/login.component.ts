import { Component } from '@angular/core';
// import { DefauldLoginLayoutComponent } from '../defauld-login-layout/defauld-login-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { PrimaryInputComponent } from '../primary-input/primary-input.component';
import { Router } from '@angular/router';
// import { LoginService } from '../../services/login.service';
// import { ToastrService } from 'ngx-toastr'; // Importe o ToastrService
import { AuthService } from '../../../auth.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
// import { Routes } from '../../app.routes';

interface LoginForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HeaderComponent,
    FooterComponent,

  ],
  providers: [
    AuthService,
    Router,
    // Routes

  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { 
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.signIn(email, password)
        .then(() => {
          // Login bem-sucedido, redirecione o usuário ou faça outras ações.
          console.log('Login realizado com sucesso!');
        })
        .catch(error => {
          // Trate o erro de login, exiba uma mensagem para o usuário.
          this.errorMessage = 'Erro ao realizar login. Verifique suas credenciais.';
          console.error('Erro no login:', error);
        });
    } else {
      this.errorMessage = 'Por favor, preencha todos os campos corretamente.';
    }
  }

  goToSignup() {
    this.router.navigate(['/signup']); 
  }
}