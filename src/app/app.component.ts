import { Component } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

declare let SockJS;
declare let Stomp;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  host : string = "http://localhost:8080";
  bConnected : boolean = false;
  stompClient : any = null;

  name : string = "";

  messages : string[] = [];

  constructor(){}

  onClickConnBtn() {

    if(this.bConnected) { //断开链接

      if (this.bConnected && this.stompClient != null) {
        this.stompClient.disconnect();
      }
      this.bConnected = false;
      console.log("Disconnected");

    } else {

      var socket = new SockJS(this.host + '/gs-guide-websocket');
      this.stompClient = Stomp.over(socket);
      this.stompClient.connect({}, (frame) => {
        this.bConnected = true;
        console.log('Connected: ' + frame);
        this.stompClient.subscribe('/topic/greetings',  greeting => {
          let content = JSON.parse(greeting.body).content;
          console.info('Receiving : ' + content);
          this.messages.push(content);
        });
      });

    }

  }

  send() {

    this.stompClient.send("/app/hello", {}, JSON.stringify({'name': this.name}));

  }

}
