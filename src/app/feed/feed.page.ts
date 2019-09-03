import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { File } from '@ionic-native/file/ngx';
import * as firebase from 'firebase';
@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {
  text:string;
  chatRef:any;
  uid:string;

  mainuser: AngularFirestoreDocument
	userPosts
	sub
	posts
	username: string
  profilePic: string
  
  text1 = 'Check out the Ionic Academy!';
  url = 'https://ionicacademy.com';
  constructor(
    private router: Router,
     private user:UserService,
     public af:AngularFireAuth,
     public fs:AngularFirestore,
     private socialSharing: SocialSharing,
     private file: File
  ) {
    this.uid=localStorage.getItem('userid');
    this.chatRef=this.fs.collection('chats',ref=>ref.orderBy('Timestamp')).valueChanges();

    this.mainuser = fs.doc(`users/${user.getUID()}`)
		this.sub = this.mainuser.valueChanges().subscribe(event => {
			this.posts = event.posts
			this.username = event.username
      this.profilePic = event.profilePic
      this.uid=this.user.getUID();
      // console.log(uid);
		})
   }
  
  send(){
    if(this.text != ''){
      this.fs.collection('chats').add({
        Name:this.username,
        Message:this.text,
        UserID:this.af.auth.currentUser.uid,
        Timestamp:firebase.firestore.FieldValue.serverTimestamp(),
      });
        this.text='';
    }
  }
  
  async shareTwitter() {
    // Either URL or Image
    this.socialSharing.shareViaTwitter(null, null, this.url).then(() => {
      // Success
    }).catch((e) => {
      // Error!
    });
  }
 
  async shareWhatsApp() {
    // Text + Image or URL works
    this.socialSharing.shareViaWhatsApp(this.text, null, this.url).then(() => {
      // Success
    }).catch((e) => {
      // Error!
    });
  }
 
  async resolveLocalFile() {
    return this.file.copyFile(`${this.file.applicationDirectory}www/assets/imgs/`, 'academy.jpg', this.file.cacheDirectory, `${new Date().getTime()}.jpg`);
  }
 
  removeTempFile(name) {
    this.file.removeFile(this.file.cacheDirectory, name);
  }
 
  async shareEmail() {
 
// Check if sharing via email is supported
this.socialSharing.canShareViaEmail().then(() => {
  // Sharing via email is possible
}).catch(() => {
  // Sharing via email is not possible
});

// Share via email
this.socialSharing.shareViaEmail('Body', 'Subject', ['recipient@example.org']).then(() => {
  // Success!
}).catch(() => {
  // Error!
});
}
  async shareFacebook() {
    let file = await this.resolveLocalFile();
 
    // Image or URL works
    this.socialSharing.shareViaFacebook(null, file.nativeURL, null).then(() => {
      this.removeTempFile(file.name);
    }).catch((e) => {
      // Error!
    });
  }

  ngOnInit() {
  }

}
