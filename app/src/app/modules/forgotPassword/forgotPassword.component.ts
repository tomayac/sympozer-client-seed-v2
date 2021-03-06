import { Component, OnInit } from '@angular/core';
import {Router}            from '@angular/router';
import {routerTransition} from '../../app.router.animation';
import {ApiExternalServer} from '../../services/ApiExternalServer';
import {MdSnackBar} from "@angular/material";
import {VoteService} from '../../services/vote.service'
import {LocalDAOService} from "../../localdao.service";
import {LocalStorageService} from 'ng2-webstorage';
import {ForgotPasswordService} from './forgotPassword.service';

@Component({
    selector: 'forgotPassword',
    templateUrl: './forgotPassword.component.html',
    styleUrls: ['./forgotPassword.component.scss'],
    providers: [ForgotPasswordService]
})

export class ForgotPasswordComponent implements OnInit {

    private key_localstorage_user = "user_external_ressource_sympozer";

    constructor(private router: Router,
        private apiExternalServer: ApiExternalServer,
        public snackBar: MdSnackBar,
        private DaoService: LocalDAOService,
        private localStoragexx: LocalStorageService,
        private ForgotPasswordService : ForgotPasswordService ) {

        }

    ngOnInit() {
		let user = this.localStoragexx.retrieve(this.key_localstorage_user);
        if(user !== null){
        	let urlHost = window.location.protocol+'//'+window.location.host + window.location.pathname
            window.location.replace(urlHost+'#/home');
        }
	
    }
    
    /**
	 *
	 * @param email
	 */
	forgotPassword(email){
		
		this.apiExternalServer.forgotPassword(email)
            .then(() => {
                this.snackBar.open("A mail has been sent to your email. Please follow the instruction in the email to reset your password", "", {
					duration: 3000,
				});
				this.snackBar.open("Please follow the instruction in the email to reset your password", "", {
					duration: 3000,
				});
                let urlHost = window.location.protocol+'//'+window.location.host + window.location.pathname;
                window.location.replace(urlHost+'#/login');
            })
            .catch((err) => {
                this.snackBar.open(err, "", {
                    duration: 3000,
                });
            });
    }

}

