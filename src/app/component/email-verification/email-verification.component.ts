import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FooterComponent, HeaderComponent],
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
      const { email, verificationCode } = this.verificationForm.value;
      this.authService.confirmSignUp(email, verificationCode)
        .then(() => {
          this.successMessage = 'Email verificado com sucesso!';
          console.log('Email verificado com sucesso. Preparando para redirecionar...');
          // Redirecionar para a página de autenticação após um atraso
          setTimeout(() => {
            this.successMessage = 'Redirecionando para a tela de login...';
            console.log('Redirecionando para a tela de login...');
            setTimeout(() => {
              this.router.navigate(['/login']).then(() => {
                console.log('Redirecionado para a tela de login.');
              }).catch((error) => {
                console.error('Erro ao redirecionar:', error);
              });
            }, 2000); // Redireciona para a tela de login após 2 segundos
          }, 3000); // Mostra a mensagem de sucesso por 3 segundos
        })
        .catch(error => {
          this.errorMessage = 'Erro ao verificar email. Verifique o código informado.';
          console.error('Erro na verificação de email:', error);
        });
    } else {
      this.errorMessage = 'Por favor, preencha todos os campos corretamente.';
    }
  }
  

  resendVerificationCode() {
    if (this.verificationForm) {
      if (this.verificationForm.get('email')?.valid) {
        const email = this.verificationForm.get('email')?.value;
        this.authService.resendVerificationCode(email)
          .then(() => {
            console.log('Código de verificação reenviado com sucesso!');
            this.successMessage = 'Código de verificação reenviado!';
            setTimeout(() => {
              this.successMessage = '';
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
