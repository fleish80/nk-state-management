import {Component} from '@angular/core';
import {StateService} from '../core/state.service';

@Component({
    selector: 'app-child',
    template: `
        <pre>{{(childStateService.state$ | async) | json}}</pre>
        <button (click)="add()">Add</button>
    `
})
export class ChildComponent {

    constructor(public childStateService: StateService) {
    }

    add() {
        this.childStateService.actions.next({type: 'increase'});
    }

}
