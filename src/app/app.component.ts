import {Component, OnInit} from '@angular/core';
import {Action, ActionHandler, ActionHandlers, InitialState, SideEffect, StateService} from './core/state.service';
import {withLatestFrom} from 'rxjs/operators';

export const initialState = {count: 0};

export class CountActionHandler implements ActionHandler {
    handleAction(currentState: any, action: Action): any {
        if (action.type === 'increase') {
            return {count: currentState.count + 1}
        }
        return currentState;
    }
}

export class AppActionHandler implements ActionHandler {
    handleAction(currentState: any, action: Action): any {
        if (action.type === 'init') {
            console.log('another handler');
            return {count: currentState.count + 1}
        }

        return currentState;
    }
}

@Component({
    selector: 'app-root',
    template: `
        <h1>State App</h1>
        <pre>{{stateService.state$ | async | json}}</pre>
        <button (click)="add()">Add</button>
        <app-child></app-child>
    `,
    providers: [
        StateService,
        {
            provide: ActionHandlers,
            useClass: CountActionHandler,
            multi: true
        },
        {
            provide: ActionHandlers,
            useClass: AppActionHandler,
            multi: true
        },
        {
            provide: InitialState,
            useValue: initialState
        }]
})
export class AppComponent extends SideEffect implements OnInit {

    constructor(public stateService: StateService) {
        super(stateService);
    }

    ngOnInit(): void {
        this.actions$.subscribe(() => alert('side effect'));
    }

    add() {
        this.stateService.actions.next({type: 'increase'});
    }
}
