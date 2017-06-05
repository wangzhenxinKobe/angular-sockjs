import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";

declare let SockJS;
declare let Stomp;

declare var $ : any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  host : string = "http://localhost:8080";
  bConnected : boolean = false;
  stompClient : any = null;

  interactive_plot : any = null;
  flot_data : any = [];

  time_span : number = 1000;

  messages : string[] = [];

  constructor(private http: Http) {}

  ngOnInit() {

    for(let i = 0; i < 100; i++) {
      this.flot_data.push(0);
    }

    this.interactive_plot = $.plot("#interactive", [this.getDataList(0)], {
      grid: {
        borderColor: "#f3f3f3",
        borderWidth: 1,
        tickColor: "#f3f3f3"
      },
      series: {
        shadowSize: 0, // Drawing is faster without shadows
        color: "#3c8dbc"
      },
      lines: {
        fill: true, //Converts the line chart to area chart
        color: "#3c8dbc"
      },
      yaxis: {
        min: 0,
        max: 200,
        show: true
      },
      xaxis: {
        show: true
      }
    });

  }

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

        this.stompClient.subscribe('/topic/flotdata',  data => {

          let times = JSON.parse(data.body).times;
          let yValue = JSON.parse(data.body).yValue;

          this.flot(yValue + 50);

          let content = `Receiving : [${yValue}] at times[${times}]`;
          console.info(content);
          this.messages.unshift(content);
          if(this.messages.length > 10) {
            this.messages.pop();
          }

        });
      });

    }
  }


  flot(yValue) {

    this.interactive_plot.setData([this.getDataList(yValue)]);
    this.interactive_plot.draw();

  }

  getDataList(yValue) {

    if (this.flot_data.length > 0)
      this.flot_data = this.flot_data.slice(1);

    this.flot_data.push(yValue);

    // Zip the generated y values with the x values
    var res = [];
    for (var i = 0; i < this.flot_data.length; ++i) {
      res.push([i, this.flot_data[i]]);
    }

    return res;
  }

  sendTimeSpan(){

    let url = this.host + '/timespan?span=' + this.time_span;

    this.http.get(url).subscribe(
      (res) => console.info('Success!'),
      (error) => alert(error)
    );

  }

}
