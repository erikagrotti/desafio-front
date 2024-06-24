import { Component } from '@angular/core';
import { DefauldLoginLayoutComponent } from '../defauld-login-layout/defauld-login-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../primary-input/primary-input.component';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr'; // Importe o ToastrService

interface signupForm {
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  passwordConfirm: FormControl<string | null>
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
    LoginService
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm!: FormGroup<signupForm>;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService // Injete o ToastrService
  ) {
    this.signupForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  submit() {
    if (this.signupForm.invalid) {
      return;
    }
    
    const email = this.signupForm.value.email ?? '';
    const password = this.signupForm.value.password ?? '';
    this.loginService.login(email, password).subscribe({
      next: () => this.toastService.success("Login feito com sucesso!"),
      error: () => this.toastService.error("Erro inesperado! Tente novamente mais tarde")
    });
  }

  navigate() {
    this.router.navigate(["/login"]);
  }
}
