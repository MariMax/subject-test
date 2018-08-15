import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {distinctUntilChanged, distinctUntilKeyChanged} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  private subject = new Subject<any>();
  private counter = 0;
  private shouldIadd = 0;
  private debounceSub: Subscription;
  private debounceKeySub: Subscription;
  private simpleSub: Subscription;

  broadcast() {
    this.subject.next({
      counter: this.counter,
    });
  }

  ngOnInit() {
    this.debounceSub = this.subject
      .pipe(distinctUntilChanged())
      .subscribe(value => console.log('distinct until changed, should print all the time', value.counter));
    this.debounceKeySub = this.subject
      .pipe(distinctUntilKeyChanged('counter'))
      .subscribe(value => console.log('distinct until key changed should pring every second time',value.counter));
    this.simpleSub = this.subject
      .subscribe(value => {
        if (this.shouldIadd % 2) this.counter++;
        this.shouldIadd = (this.shouldIadd % 2) + 1;
        console.log('simple case should print all the time',value.counter);
      });
  }

  ngOnDestroy() {
    this.debounceKeySub.unsubscribe();
    this.debounceSub.unsubscribe();
    this.simpleSub.unsubscribe();
  }
}
