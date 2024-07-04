import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

// import { ToastrService } from 'ngx-toastr';
// import { DefauldLoginLayoutComponent } from '../../component/defauld-login-layout/defauld-login-layout.component';

interface SignupForm {
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  passwordConfirm: FormControl<string | null>;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HeaderComponent,
    FooterComponent
    // DefauldLoginLayoutComponent
  ],
  providers: [
    AuthService,
    Router
    // CommonModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
    signupForm: FormGroup;
    errorMessage: string = '';
  
    constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {
        this.signupForm = new FormGroup({
          email: new FormControl('', [Validators.required, Validators.email]),
          password: new FormControl('', [Validators.required, Validators.minLength(8)]),
          confirmPassword: new FormControl('', [Validators.required])
        }, { validators: this.passwordMatchValidator }); // Aplica a validação aqui
      }
      onSubmit() {
        console.log("Formulário enviado!", this.signupForm.value);
    
        if (this.signupForm.valid) {
          const { email, password } = this.signupForm.value;
          this.authService.signUp(email, password)
            .then((result) => {
              console.log('Usuário cadastrado com sucesso!', result);
              this.router.navigate(['/autentification']); 
            })
            .catch(error => {
              this.errorMessage = 'Erro ao cadastrar usuário. Verifique os dados informados.';
              console.error('Erro no cadastro:', error);
            });
        } else {
          this.errorMessage = 'Por favor, preencha todos os campos corretamente.';
        }
      }
      
      // Modifique a função para aceitar um AbstractControl:
      passwordMatchValidator(control: AbstractControl): { passwordMismatch: boolean } | null { 
        const password = control.get('password')?.value;
        const confirmPassword = control.get('confirmPassword')?.value;
    
        return password === confirmPassword ? null : { passwordMismatch: true };
      }

      goToLogin() {
        this.router.navigate(['/login']);
      }
}