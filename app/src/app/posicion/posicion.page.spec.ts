import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PosicionPage } from './posicion.page';

describe('PosicionPage', () => {
  let component: PosicionPage;
  let fixture: ComponentFixture<PosicionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosicionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PosicionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
