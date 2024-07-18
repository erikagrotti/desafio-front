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
      console.log('Email extraído dos parâmetros:', this.email);
    });
  }

  onSubmit() {
    if (this.verificationForm && this.verificationForm.valid) {
      const { verificationCode } = this.verificationForm.value;
      
      this.authService.confirmSignUp(this.email, verificationCode)
        .then(() => {
          this.successMessage = 'Email verificado com sucesso!';
          console.log('Email verificado com sucesso. Preparando para redirecionar...');
          // Redirecionar para a página de autentificação após um atraso
          setTimeout(() => {
            
            if (typeof window !== 'undefined') {
              window.location.href = '/main'
            }
            console.log('Redirecionando para a tela de login...');
          
          }, 2000); // Mostra a mensagem de sucesso por 2 segundos
          // this.router.navigate(['/main']);
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
    if (this.email) {
      this.authService.resendVerificationCode(this.email)
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
