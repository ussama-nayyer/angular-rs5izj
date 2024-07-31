import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface UserDto {
  username: string;
  email: string;
  type: 'user' | 'admin';
  password: string;
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  userForm: FormGroup;
  isSubmitting: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.userForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(24),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      type: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(24),
          this.passwordValidator,
        ],
      ],
    });
  }

  ngOnInit() {}

  private passwordValidator(control: any) {
    const value = control.value;
    if (!value) return null;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    if (hasUpperCase && hasLowerCase && hasSpecialChar) {
      return null;
    }
    return { passwordStrength: true };
  }

  async onSubmit() {
    if (this.userForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const user: UserDto = this.userForm.value;
    try {
      await this.createUser(user);
    } catch (error) {
      console.log(error);
    } finally {
      this.isSubmitting = false;
    }
  }

  private async createUser(user: UserDto) {
    await new Promise((res) => setTimeout(res, 2500));
    try {
      const response = await this.http
        .post(
          'https://nodetul1gb-jbwb--3000--41692973.local-credentialless.webcontainer.io/register',
          user
        )
        .toPromise();
      return response;
    } catch (error) {
      return Promise.reject(error.message || 'Request Failed');
    }
  }
}
