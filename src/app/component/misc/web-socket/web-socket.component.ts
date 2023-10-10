import { Component, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import { AuthenticationService } from 'src/app/module/appuser/service/authentication.service';
import { BlockUiService } from 'src/app/service/block-ui.service';
import { TaskWaitingForUserExecutionService } from 'src/app/service/task-waiting-for-user-execution.service';
import { environment } from 'src/environments/environment';

// This component has not been used because for some reason we cannot communicate with the
//   websocket, maybe a problem with pound proxy maybe a problem with the hospital firewall.
// We get the following error:
// WebSocketSubject.js:90 WebSocket connection to 'ws://traquer-noumea-appli1:7980/api/websocket'
@Component({
  selector: 'app-web-socket',
  templateUrl: './web-socket.component.html',
  styleUrls: ['./web-socket.component.scss']
})
export class WebSocketComponent implements OnInit {

  // Observable subscriptions
  subscriptions: Subscription[] = [];

  myWebSocket: WebSocketSubject<any>;

  constructor(
    private authenticationService:AuthenticationService,
    private taskWaitingForUserExecutionService:TaskWaitingForUserExecutionService
  ) {

  }

  ngOnInit(): void {
    this.openWebSocket();
    this.createIntervalsSubscriptions();
  }

  openWebSocket() {

    let apiURL = environment.apiURL.replace("http","ws");
    if (!apiURL.endsWith("/")) {
      apiURL += "/";
    }
    console.log(`apiURL[${apiURL}]`);
    this.myWebSocket = webSocket(apiURL + 'websocket');

    // Subscribe to incoming messages
    this.myWebSocket.asObservable().subscribe(dataFromServer => {
      console.log(dataFromServer);
      if (dataFromServer.action == "executePendingTasks") {
        this.taskWaitingForUserExecutionService.executePendingTasks().subscribe(res => {
          // Do nothing
        })
      }
    });

  }

  createIntervalsSubscriptions() {

    let checkIfAnyPendingTaskSubscription = interval(
      1000 * environment.numberOfSecondsBetweenCheckIfAnyPendingTask).subscribe(x => {

      if (this.myWebSocket.closed) {
        console.log("WebSocketService: WebSocket is closed.");
      }
      this.myWebSocket.next(
        {
          action: "checkIfAnyPendingTask"
        }
      );

    });

    this.subscriptions.push(checkIfAnyPendingTaskSubscription);

  }


  ngOnDestroy() {

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());

  }



}
