import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})
export class EmailVerificationComponent {
  verificationForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    verificationCode: new FormControl('', [Validators.required])
  });
  errorMessage: string = '';
  successMessage: string = '';
  email: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Extraia o email da URL
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      if (this.email) {
        // Atualiza o valor do campo de email no formulário
        this.verificationForm.patchValue({ email: this.email });
      }
    });
  }

  onSubmit() {
    if (this.verificationForm && this.verificationForm.valid) {
      // Verifique se o formulário existe
      const { email, verificationCode } = this.verificationForm.value;
      this.authService.confirmSignUp(email, verificationCode)
        .then(() => {
          this.successMessage = 'Email verificado com sucesso!';
          // Redirecionar para a página de login após um atraso
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        })
        .catch(error => {
          this.errorMessage = 'Erro ao verificar email. Verifique o código informado.';
          console.error('Erro na verificação de email:', error);
        });
    } else {
      this.errorMessage = 'Por favor, investigue todos os campos.';
    }
  }

  resendVerificationCode() {
    if (this.verificationForm) {
      // Verifica se o formulário existe
      // Validação do email do formulário
      if (this.verificationForm.get('email')?.valid) {
        const email = this.verificationForm.get('email')?.value;
        // Obtenha o valor do formulário
        this.authService.resendVerificationCode(email)
          .then(() => {
            console.log('Código de verificação reenviado com sucesso!');
            this.errorMessage = 'Código de verificação reenviado!';
            setTimeout(() => {
              this.errorMessage = '';
            }, 3000);
          })
          .catch(error => {
            console.error('Erro ao enviar código de verificação:', error);
            this.errorMessage = 'Erro ao enviar código. Tente novamente mais tarde.';
          });
      } else {
        this.errorMessage = 'Por favor, insira um endereço de email válido.';
      }
    }
  }
}
