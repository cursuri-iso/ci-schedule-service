import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app/app.module';
import { ScheduleRequestDto } from '../src/app/models/schedule-request.dto';

describe('ScheduleController (e2e)', () => {
  let app: INestApplication;

  const orgIds = [ '5c444849ba0e8844d43b968e', '5c449be43dc55e1e480e407c' ];
  const locationIds = [ '5c3a367c1f91d02808a53afb', '5c44a407ba420a24b84f9baa' ];
  const domainIds = [ '5c444f014c290b1f08614c26' ];
  const standardIds = [ '5c351e39d1713d13389c4ac1' ];
  const trainingIds = [ '5c4c0f6ceea2af1cbcefdee4', '5c4c12e530e4853c583e32d3' ];

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const scheduleRequest: ScheduleRequestDto = {
    added: [{
      org_id: '5c444849ba0e8844d43b968e',
      training_id: '5c4c0f6ceea2af1cbcefdee4',
      location_id: '5c3a367c1f91d02808a53afb',
      standards: standardIds,
      domains: domainIds,
      certified: false,
      vatFree: false,
      price: 755,
      priceCurr: 'EUR',
      duration: 3,
      startDate: new Date('2019-03-03'),
      tags: ['ai9001'],
    }, {
      org_id: '5c444849ba0e8844d43b968e',
      training_id: '5c4c0f6ceea2af1cbcefdee4',
      location_id: '5c44a407ba420a24b84f9baa',
      standards: standardIds,
      domains: domainIds,
      certified: false,
      vatFree: false,
      price: 800,
      priceCurr: 'EUR',
      duration: 4,
      startDate: new Date('2019-04-04'),
      tags: ['ai9001'],
      remark: 'in Timisoara',
    }],
  };

  it('/ (POST)', (done) => {
    return request(app.getHttpServer())
      .post('/programs')
      .send(scheduleRequest)
      .set('Content-Type', 'application/json')
      .expect(201)
      // tslint:disable-next-line:no-console
      .end((err, res) => err ? console.log(err) : done());
  });
});
