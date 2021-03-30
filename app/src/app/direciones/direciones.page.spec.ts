import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DirecionesPage } from './direciones.page';

describe('DirecionesPage', () => {
  let component: DirecionesPage;
  let fixture: ComponentFixture<DirecionesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirecionesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DirecionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
