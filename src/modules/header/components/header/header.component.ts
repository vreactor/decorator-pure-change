import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PureChange } from '@lib/decorators';

interface ICounter {
    count: number;
}

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
    @Input()
    title!: string;

    counter: ICounter = {
        count: 0,
    };
    counterPure: ICounter = {
        count: 0,
    };

    constructor() {}

    getTitle(counter: ICounter, name: string): string {
        counter.count++;

        return `[${name}] Called ${counter.count} time(s)`;
    }

    @PureChange()
    getTitlePure(counter: ICounter, name: string): string {
        counter.count++;

        return `[${name}] Called ${counter.count} time(s)`;
    }

    onClick() {
        console.log('click');
    }
}


