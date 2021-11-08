import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validator, Validators} from '@angular/forms';
import {ValidationService} from '../../../core/services/validation.service';
import {ApiService} from '../../../core/services/api.service';
import {CreateUserInput, CreateUserOutput} from '../../../models/user.model';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
	selector: 'app-singup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.less']
})
export class SignupComponent implements OnInit {

  signup: FormGroup;
  success: boolean;

  constructor(private fb: FormBuilder,
              private validateService: ValidationService,
              private apiService: ApiService,
              private message: NzMessageService) { }

  ngOnInit(): void {
  	this.signup = this.fb.group({
  		username: [null, [Validators.required, this.checkUser]],
  		email: [null, [Validators.email, Validators.required]],
  		password: [null, [Validators.required, Validators.pattern(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}\[ \]:;<>,?\/~_+-=|\\]).{8,32}/)]],
  		passwordCheck: [null, [Validators.required, this.confirmationValidator]]
  	});

    this.success = false;
  }

  /**
   * Defines what happens after the submit of the Form
   */
  onSubmit(): void {
  	for (const i in this.signup.controls) {
  		if (this.signup.controls.hasOwnProperty(i)) {
  			this.signup.controls[i].markAsDirty();
  			this.signup.controls[i].updateValueAndValidity();
  		}
  	}

  	const form = this.signup.value;
  	const data: CreateUserInput = {
  		username: form.username,
  		email: form.email,
  		password: form.password,
  		passwordCheck: form.passwordCheck,
  		role: 'member'
  	};

  	this.apiService.createUser(data).subscribe((data: CreateUserOutput) => {
  		if (data.message) {
  			this.message.create('success', 'Successfully signed Up !');
        this.signup.reset();
        this.success = true;
        setTimeout(() => this.success = false, 20000);
  		}
  	});
  }

  /**
   * Validates if the passwords equals each other
   * @param control
   */
  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
  	if (!control.value) {
  		return { required: true };
  	}
  	else if (control.value !== this.signup.controls.password.value) {
  		return { confirm: true, error: true };
  	}
  	return {};
  };

  /**
   * Validates if the user isn't used yet
   * @param control
   */
  checkUser = (control: FormControl): { [s: string]: boolean } => {
  	if(!control.value) {
  		return {require: true};
  	}
  	else if(this.validateService.isNameUsed(control.value)) {
  		return { confirm: true, error: true };
  	}
  	return {};
  }
}

