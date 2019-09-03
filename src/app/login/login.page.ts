import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase/app'

import { UserService } from '../user.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { LoadingController, AlertController, MenuController, ToastController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

	username: string = "";
	password: string = "";


	constructor(public afAuth: AngularFireAuth, 
		public user: UserService, 
		public router: Router, 
		private platform: Platform,
		 public loadingController: LoadingController,
    public alertController: AlertController,
	private splashScreen: SplashScreen,
	 private menuCtrl: MenuController,
	 public fs:AngularFirestore,
	 private toastController: ToastController
	)
		 { }

	ngOnInit() {
	}

	async login() {
		const { username, password } = this
		try {
			// kind of a hack. 
			const res = await this.afAuth.auth.signInWithEmailAndPassword(username + '@gmail.com', password)
			
			if(res.user) {
				this.user.setUser({
					username,
					uid: res.user.uid
				})
				this.router.navigate(['/tabs'])
			}
		
		} catch(err) {
			console.dir(err)
			if(err.code === "auth/user-not-found") {
				console.log("User not found")
			}
		}
	}
	
	login1() {
		this.openLoader();
		this.signInAnonymously().then(
		  (userData) => {
			console.log(userData);
			this.router.navigateByUrl('/tabs');
		  }
		).catch(err => {
			if (err) {
				this.presentToast(`${err}`, true, 'bottom', 2100);
			  }
	
		}).then(el => this.closeLoading());
	  }
	
	  async openLoader() {
		const loading = await this.loadingController.create({
		  message: 'Please Wait ...',
		  duration: 2000
		});
		await loading.present();
	  }
	  async closeLoading() {
		return await this.loadingController.dismiss();
	  }
	
	  private signInAnonymously() {
		return new Promise<any>((resolve, reject) => {
		  this.afAuth.auth.signInAnonymously().then((data) => {
			resolve(data);
		  }).catch((error) => {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
	
			reject(`login failed ${error.message}`)
			// ...
		  });
		});
	  }
	  
  async presentToast(message, show_button, position, duration) {
    const toast = await this.toastController.create({
      message: message,
      showCloseButton: show_button,
      position: position,
      duration: duration
    });
    toast.present();
  }

//   allowLoginWithCredentials() {
//     this.wantsToLoginWithCredentials = true;
  
// }

}
