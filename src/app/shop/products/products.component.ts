import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';


import { ProductElement } from '../product-element';
import { ProductService } from '../product.service';
import { HandsetService } from '../../handset.service';
import { Group } from '../group';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements AfterViewInit {

  products$: Observable<ProductElement[]>;

  group: Group;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource;
  items$: Observable<ProductElement[]>;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    public handsetService: HandsetService) { }

    ngAfterViewInit() {
    // const tmp = sessionStorage.getItem('products');

    // if (!tmp) {
    // this.getProducts();
    // }
    // else {
    //   this.products = JSON.parse(tmp);
    //   this.items$ = this.route.paramMap.pipe(
    //     switchMap((params: ParamMap) =>

    //         this.filter(params.get('word'))

    //     )
    //   );
    // }

    // this.group$ = this.route.paramMap.pipe(
    //   switchMap((params: ParamMap) => {
    //     return of({
    //       group_id: params.get('id'),
    //       group_name: params.get('name')
    //     });
    //   }
    //   )
    // )

    this.products$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>  {
        setTimeout(() => this.group = {
          group_id: +params.get('id'),
          group_name: params.get('name')
        }, 0);
        return this.productService.getProducts(params.get('id'));
      })
    );

    this.products$.subscribe(
      res => {
        this.dataSource =  new MatTableDataSource<ProductElement>(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.items$ = this.dataSource.connect();
      }
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  getProducts(): void {



    // this.productService.getProducts()
    //   .subscribe(products => {
    //     this.products = products;
    //     this.items$ = this.route.paramMap.pipe(
    //       switchMap((params: ParamMap) =>

    //           this.filter(params.get('word'))

    //       )
    //     );
    //   });
  }

  search() {
    this.products$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.productService.search(params.get('word'))
      )
    );

    // const reg = new RegExp(word.trim(), 'g');
    // return of(this.products.filter(i => i.name.match(reg)));
  }




  canDeactivate(): Observable<boolean> | boolean {
    this.save();
    return true;
  }

  save() {
  }


  pr() {
    console.log(this.dataSource);
  }

}
