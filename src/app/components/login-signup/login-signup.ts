import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { NgIf } from '@angular/common';

interface location{
  id:number,
  location:string
}

@Component({
  selector: 'app-login-signup',
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './login-signup.html',
  styleUrl: './login-signup.css'
})
export class LoginSignup {
  form!: FormGroup;
  isLoginPage = true;
  locations:location[]=[]
  private baseUrl = 'https://smallmarketbackendlaravel-production.up.railway.app/api';
  private router = inject(Router);



  constructor(private fb: FormBuilder, private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.loadLocation()
    this.isLoginPage = window.location.href.includes('/login');

    this.form = this.isLoginPage
      ? this.fb.group({
        gmail: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
      })
      : this.fb.group({
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        gender: ['', Validators.required],
        gmail: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        phone_number: ['', Validators.required],
        is_admin: [false],
        location_id: ['', Validators.required]
      });
  }

  loadLocation(){
    this.http.get(`${this.baseUrl}/locations`).subscribe({
      next:(res:any)=>{
        this.locations = res.data
        
      }
    })
  }
  errorMessage: any;
  onSubmit(): void {
    const endpoint = this.isLoginPage ? '/login' : '/register';
    this.http.post(`${this.baseUrl}${endpoint}`, this.form.value).subscribe({
      next: (res: any) => {
        localStorage.setItem('Token', res.token);


        const returnUrl = this.router.parseUrl(this.router.url).queryParams['returnUrl'] || '/home';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        if (err.status === 401) {
          // Handle unauthorized error (invalid credentials)
          this.errorMessage = 'Invalid email or password';
          alert(this.errorMessage)
        } 
        if (err.status === 422) {
          // Handle unauthorized error (invalid credentials)
          this.errorMessage = 'Plz input all field';
          alert(this.errorMessage)
        } 
      }

    });
  }
}
