import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  gender: string;
  gmail: string;
  phone_number: string;
  is_admin: number;
  location_id: number | null;
  reg_date: string;
  created_at: string;
  updated_at: string;
}

interface Location {
  id: number;
  location: string;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-user',
  imports: [ ReactiveFormsModule,DatePipe
  ],
  templateUrl: './user.html',
  styleUrl: './user.css'
})
export class User {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef)
  private router = inject(Router);
  
  baseUrl: string = 'https://smallmarketbackendlaravel-production.up.railway.app/api';
  isEditing = false;
  userForm: FormGroup;
  currentUser: UserData | null = null;
  locations: Location[] = [];
  isLoading = true;

  constructor() {
    this.userForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      gender: [''],
      gmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(8)]],
      phone_number: [''],
      location_id: [null]
    });

    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    
    // Load user data
    this.http.get<{status: boolean, message: string, data: UserData}>(`${this.baseUrl}/me`).subscribe({
      next: (userRes) => {
        this.currentUser = userRes.data;
        
        // Load locations
        this.http.get<{data: Location[]}>(`${this.baseUrl}/locations`).subscribe({
          next: (locRes) => {
            this.locations = locRes.data;
            this.updateFormValues();
            this.isLoading = false;
            this.cdr.detectChanges()
          },
          error: (locErr) => {
            console.error('Error loading locations', locErr);
            this.isLoading = false;
          }
        });
      },
      error: (userErr) => {
        console.error('Error loading user data', userErr);
        this.isLoading = false;
      }
    });
  }

  updateFormValues() {
    if (this.currentUser) {
      this.userForm.patchValue({
        first_name: this.currentUser.first_name,
        last_name: this.currentUser.last_name,
        gender: this.currentUser.gender,
        gmail: this.currentUser.gmail,
        phone_number: this.currentUser.phone_number,
        location_id: this.currentUser.location_id
      });
    }
  }

  getLocationName(locationId: number | null): string {
    if (!locationId) return 'Not specified';
    const location = this.locations.find(loc => loc.id === locationId);
    return location ? location.location : 'Unknown location';
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.updateFormValues(); // Reset form if canceled
    }
  }

  saveProfile() {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      
      // Remove password if empty
      if (!formData.password) {
        delete formData.password;
      }

      this.http.put(`${this.baseUrl}/update`, formData).subscribe({
        next: (res: any) => {
          this.isEditing = false;
          this.currentUser = res.data;
          alert('Profile updated successfully!');
          this.loadData(); // Refresh data
        },
        error: (err) => {
          console.error('Error updating profile', err);
          alert('Error updating profile');
        }
      });
    }
  }
showLogoutModal = false;

  onLogoutClick() {
    this.showLogoutModal = true;
  }

  confirmLogout() {
    this.http.delete(`${this.baseUrl}/logout`).subscribe({
      next:(res:any)=>{
        console.log(res)
        this.router.navigateByUrl('/home');
        localStorage.removeItem('Token');
      }
    })
    console.log('User confirmed logout');

    this.showLogoutModal = false;
  }

  cancelLogout() {
    this.showLogoutModal = false;
  }
}
