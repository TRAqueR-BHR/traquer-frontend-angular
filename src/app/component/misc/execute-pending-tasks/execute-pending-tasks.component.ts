import { Component, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import { AuthenticationService } from 'src/app/module/appuser/service/authentication.service';
import { BlockUiService } from 'src/app/service/block-ui.service';
import { TaskWaitingForUserExecutionService } from 'src/app/service/task-waiting-for-user-execution.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-execute-pending-tasks',
  templateUrl: './execute-pending-tasks.component.html',
  styleUrls: ['./execute-pending-tasks.component.scss']
})
export class ExecutePendingTasksComponent implements OnInit {

  // Observable subscriptions
  subscriptions: Subscription[] = [];

  constructor(
    private taskWaitingForUserExecutionService:TaskWaitingForUserExecutionService
  ) { }

  ngOnInit(): void {
    // this.taskWaitingForUserExecutionService.executePendingTasks().subscribe(res => {
    //   // Do nothing
    // })
    this.createIntervalsSubscriptions();
  }


  createIntervalsSubscriptions() {

    let checkIfAnyPendingTaskSubscription = interval(
      1000 * environment.numberOfSecondsBetweenCheckIfAnyPendingTask
    ).subscribe(x => {
        this.taskWaitingForUserExecutionService.executePendingTasks().subscribe(res => {
          // Do nothing
        })
    });

    this.subscriptions.push(checkIfAnyPendingTaskSubscription);

  }


  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

}
