import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  result: any;
  token: string;
  headers = new HttpHeaders();
  userID: string;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.headers = this.headers.append('Client-ID', 'ypls83vssc96liotqk7xk8jnkpov70');
    const OAUTHParams = new HttpParams()
      .set('client_id', 'ypls83vssc96liotqk7xk8jnkpov70')
      .set('client_secret', '43cpba9clp8n38t2p4fl0lsy610n8t')
      .set('grant_type', 'client_credentials');
    // this.http.get('https://api.twitch.tv/helix/games/top', {headers}).subscribe(data => {
    //   this.result = data;
    //   console.log(this.result);
    // });

    this.http.post<{ access_token: string; refresh_token: string; expires_in: number; scope: Array<any>; token_type: string; }>
    ('https://id.twitch.tv/oauth2/token', null, {params: OAUTHParams}).subscribe(data => {
      console.log(data.access_token);
      this.token = data.access_token;
      this.onGetData();
    });
    this.http.get<{data: Array<any>;}>('https://api.twitch.tv/helix/users?login=Madd15', {headers: this.headers}).subscribe(data => {
      this.userID = data.data[0].id;
      console.log(this.userID);
    });
  }

  onUnSub() {
    this.http.post('https://api.twitch.tv/helix/webhooks/hub', JSON.stringify(
      {
        'hub.callback': 'http://localhost:3000/twitch/followers',
        'hub.mode': 'unsubscribe',
        'hub.topic': `https://api.twitch.tv/helix/users/follows?first=1&to_id=${this.userID}`,
        'hub.lease_seconds': 864000
      }
    ), {headers: this.headers}).subscribe(data => {
      console.log(data);
    });
  }

  onGetData() {
    this.headers = this.headers.append('Authorization', `Bearer ${this.token}`);
    this.headers = this.headers.append('Content-Type', `application/json`);
    console.log(this.headers);
    this.http.post('https://api.twitch.tv/helix/webhooks/hub', JSON.stringify(
      {
        'hub.callback': 'http://localhost:3000/twitch/followers',
        'hub.mode': 'subscribe',
        'hub.topic': `https://api.twitch.tv/helix/users/follows?first=1&to_id=${this.userID}`,
        'hub.lease_seconds': 864000
      }
    ), {headers: this.headers, observe: 'response'}).subscribe(res => {
      if (res.status === 202) {

      }
    });

    this.http.get('https://api.twitch.tv/helix/webhooks/subscriptions', {headers: this.headers}).subscribe(data => {
      console.log(data);
    });
  }

  onGetSubs() {
    this.http.get('https://api.twitch.tv/helix/webhooks/subscriptions', {headers: this.headers}).subscribe(data => {
      console.log(data);
    });
  }
}
