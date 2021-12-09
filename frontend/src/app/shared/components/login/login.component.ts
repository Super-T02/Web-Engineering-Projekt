import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidationService} from '../../../core/services/validation.service';
import {ApiService} from '../../../core/services/api.service';
import {Router} from '@angular/router';
import {LastRouteService} from '../../../core/services/last-route.service';
import {AuthService} from '../../../core/services/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  login: FormGroup;

  constructor(private fb: FormBuilder,
              private validateService: ValidationService,
              private api: ApiService,
              private router: Router,
              private lastRoute: LastRouteService,
              private auth: AuthService) { }

  ngOnInit(): void {
  	this.login = this.fb.group({
  		username: [null, Validators.required], // TODO: Service for validating data
  		password: [null, Validators.required]
  	});
  }

  onSubmit(): void {
    // Validate Form
    for (const i in this.login.controls) {
      if (this.login.controls.hasOwnProperty(i)) {
        this.login.controls[i].markAsDirty();
        this.login.controls[i].updateValueAndValidity();
      }
    }

    // Send data to api
    this.api.login(this.login.value)
      .subscribe((output) => {
        this.login.reset();

        localStorage.setItem('accessToken', output.data.accessToken);
        localStorage.setItem('refreshToken', output.data.refreshToken);
        this.auth.authenticated = true;
        this.auth.actualizeName();

        // Redirect to last visited page or default dashboard
        this.router.navigate([this.lastRoute.route], {queryParams: this.lastRoute.query}).then();
      });

  }
}
