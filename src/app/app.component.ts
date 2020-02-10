import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  static TAX_RATE = 1.06;

  environment = environment;
  form: FormGroup;
  totalFee: number = 1000;

  calculationColumns: string[] = ['label', 'taxSeparated', 'taxIncluded'];
  calculationResult: CalculationRow[] = [
    {
      title: 'compulsoryBrokerage',
      label: '交强佣金',
      taxSeparated: 0,
      taxIncluded: 0
    },
    {
      title: 'commercialBrokerage',
      label: '商业佣金',
      taxSeparated: 0,
      taxIncluded: 0
    },
    {
      title: 'totalBrokerage',
      label: '总佣金',
      taxSeparated: 0,
      taxIncluded: 0
    },
    {
      title: 'netFee',
      label: '净费',
      taxSeparated: 0,
      taxIncluded: 0
    }
  ];

  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      compulsoryFee: 500,
      commercialFee: 500,
      compulsoryBrokerageRate: 0.04,
      commercialBrokerage: 0.32
    });

    combineLatest(
      this.form.controls.compulsoryFee.valueChanges
        .pipe(startWith(this.form.controls.compulsoryFee.value)),
      this.form.controls.commercialFee.valueChanges
        .pipe(startWith(this.form.controls.commercialFee.value)),
      this.form.controls.compulsoryBrokerageRate.valueChanges
        .pipe(startWith(this.form.controls.compulsoryBrokerageRate.value)),
      this.form.controls.commercialBrokerage.valueChanges
        .pipe(startWith(this.form.controls.commercialBrokerage.value)),
    ).subscribe(result => {
      const [compulsoryFee, commercialFee, compulsoryBrokerageRate, commercialBrokerage] = result;
      this.totalFee = compulsoryFee + commercialFee;

      this.calculationResult.forEach(item => {
        switch (item.title) {
          case 'compulsoryBrokerage':
            item.taxSeparated = compulsoryFee * compulsoryBrokerageRate;
            item.taxIncluded = compulsoryFee * compulsoryBrokerageRate;
            break;
          case 'commercialBrokerage':
            item.taxSeparated = commercialFee * commercialBrokerage / AppComponent.TAX_RATE;
            item.taxIncluded = commercialFee * commercialBrokerage;
            break;
        }
      })
      this.calculationResult.forEach(item => {
        switch (item.title) {
          case 'totalBrokerage':
            item.taxSeparated = this.sumBrokerage('taxSeparated');
            item.taxIncluded = this.sumBrokerage('taxIncluded');
            break;
        }
      })
      this.calculationResult.forEach(item => {
        switch (item.title) {
          case 'netFee':
            item.taxSeparated = this.totalFee - this.getRowValue('totalBrokerage', 'taxSeparated');
            item.taxIncluded = this.totalFee - this.getRowValue('totalBrokerage', 'taxIncluded');
            break;
        }
      })
    })
  }

  private sumBrokerage(columnName) {
    return this.calculationResult.reduce((pre, row) => {
      if (['compulsoryBrokerage', 'commercialBrokerage'].indexOf(row.title) >= 0) {
        return pre + row[columnName];
      }
      return pre;
    }, 0);
  }

  private getRowValue(title, columnName) {
    const foundRow = this.calculationResult.find(row => {
      return row.title === title
    })
    return foundRow ? foundRow[columnName] : 0;
  }

  public onInputFocus(inputControlDom) {
    inputControlDom.select();
  }
}

export interface CalculationRow {
  title: string;
  label: string;
  taxSeparated: number;
  taxIncluded: number;
}
