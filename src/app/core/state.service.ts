import {BehaviorSubject, Observable} from "rxjs";
import {Inject, Injectable, InjectionToken} from "@angular/core";
import {withLatestFrom} from 'rxjs/operators';

export interface Action {
    type: string;
}

export interface ActionHandler {
    handleAction(currentState: any, action: Action): any;
}

export const ActionHandlers = new InjectionToken(
    'lookup for action handlers',
    {providedIn: 'root', factory: () => []}
)

export const InitialState = new InjectionToken(
    'lookup for initial state',
    {providedIn: 'root', factory: () => null}
)

@Injectable()
export class StateService {
    private _state: BehaviorSubject<any>;

    actions: BehaviorSubject<Action>;
    state$: Observable<any>;

    constructor(@Inject(InitialState) initialState: any,
                @Inject(ActionHandlers) actionHandlers: ActionHandler[]) {
        this._state = new BehaviorSubject<any>(initialState)
        this.actions = new BehaviorSubject<Action>({type: 'init'})

        this.actions.subscribe(action => {
            const nextState = this._state.getValue();
            actionHandlers.forEach( handler => {
                Object.assign(nextState, handler.handleAction(nextState, action))
            });
            this._state.next(nextState);
        });

        this.state$ = this._state.asObservable();
    }
}

export class SideEffect {
    actions$;

    constructor(state: StateService) {
        this.actions$ = state.actions.pipe(
            withLatestFrom(state.state$)
        )
    }
}
