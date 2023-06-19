/* tslint:disable max-line-length */
import { vitest } from 'vitest';
import { shallowMount, MountingOptions } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import { RouteLocation } from 'vue-router';

import dayjs from 'dayjs';
import { DATE_TIME_LONG_FORMAT } from '../../../......mainwebappapp/shared/composables/date-format';
import EmployeeUpdate from '../../../......mainwebappapp/entities/employee/employee-update.vue';
import EmployeeService from '../../../......mainwebappapp/entities/employee/employee.service';
import AlertService from '../../../......mainwebappapp/shared/alert/alert.service';

import EmployeeService from '../../../......mainwebappapp/entities/employee/employee.service';
import DepartmentService from '../../../......mainwebappapp/entities/department/department.service';

type EmployeeUpdateComponentType = InstanceType<typeof EmployeeUpdate>;

let route: Partial<RouteLocation>;
const routerGoMock = vitest.fn();

vitest.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const employeeSample = { id: 123 };

describe('Component Tests', () => {
  let mountOptions: MountingOptions<EmployeeUpdateComponentType>['global'];
  let alertService: AlertService;

  describe('Employee Management Update Component', () => {
    let comp: EmployeeUpdateComponentType;
    let employeeServiceStub: SinonStubbedInstance<EmployeeService>;

    beforeEach(() => {
      route = {};
      employeeServiceStub = sinon.createStubInstance<EmployeeService>(EmployeeService);

      alertService = new AlertService({
        i18n: { t: vitest.fn() } as any,
        bvToast: {
          toast: vitest.fn(),
        } as any,
      });

      mountOptions = {
        stubs: {
          'font-awesome-icon': true,
          'b-input-group': true,
          'b-input-group-prepend': true,
          'b-form-datepicker': true,
          'b-form-input': true,
        },
        provide: {
          alertService,
          employeeService: () => employeeServiceStub,
          employeeService: () =>
            sinon.createStubInstance<EmployeeService>(EmployeeService, {
              retrieve: sinon.stub().resolves({}),
            } as any),
          departmentService: () =>
            sinon.createStubInstance<DepartmentService>(DepartmentService, {
              retrieve: sinon.stub().resolves({}),
            } as any),
        },
      };
    });

    afterEach(() => {
      vitest.resetAllMocks();
    });

    describe('load', () => {
      beforeEach(() => {
        const wrapper = shallowMount(EmployeeUpdate, { global: mountOptions });
        comp = wrapper.vm;
      });
      it('Should convert date from string', () => {
        // GIVEN
        const date = new Date('2019-10-15T11:42:02Z');

        // WHEN
        const convertedDate = comp.convertDateTimeFromServer(date);

        // THEN
        expect(convertedDate).toEqual(dayjs(date).format(DATE_TIME_LONG_FORMAT));
      });

      it('Should not convert date if date is not present', () => {
        expect(comp.convertDateTimeFromServer(null)).toBeNull();
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const wrapper = shallowMount(EmployeeUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.employee = employeeSample;
        employeeServiceStub.update.resolves(employeeSample);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(employeeServiceStub.update.calledWith(employeeSample)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        employeeServiceStub.create.resolves(entity);
        const wrapper = shallowMount(EmployeeUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.employee = entity;

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(employeeServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        employeeServiceStub.find.resolves(employeeSample);
        employeeServiceStub.retrieve.resolves([employeeSample]);

        // WHEN
        route = {
          params: {
            employeeId: '' + employeeSample.id,
          },
        };
        const wrapper = shallowMount(EmployeeUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(comp.employee).toMatchObject(employeeSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        employeeServiceStub.find.resolves(employeeSample);
        const wrapper = shallowMount(EmployeeUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
