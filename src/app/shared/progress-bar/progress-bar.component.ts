import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {
  @ViewChild('progressBar') progressBarRef!: ElementRef;
  progressBar!: HTMLDivElement;
  // valueNow: number = 0;
  // subscriptionChangeValue: Subscription;
  // @Input() number!: Subject<number>;
  @Input() title!: string;
  constructor(
    
  ) { 
    // this.subscriptionChangeValue = this.number.subscribe((num: number) => {
    //   // this.valueNow = num;
    //   this.progressBar.setAttribute('aria-valuenow',num.toString());
    // });
  }

  ngOnInit(): void {
    
  }
  ngAfterViewInit() {
    this.progressBar = this.progressBarRef.nativeElement;
  }
  changeProgressBarValue(num: number){
    this.progressBar.setAttribute('aria-valuenow', num.toString());
    this.progressBar.setAttribute('style',`width: ${num.toString()}%`)
  }
  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    // this.subscriptionChangeValue.unsubscribe();
  }

}
