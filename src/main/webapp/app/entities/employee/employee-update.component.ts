import { computed, defineComponent, inject, ref, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';

import { useValidation, useDateFormat } from '@/shared/composables';
import { useAlertService } from '@/shared/alert/alert.service';

import EmployeeService from '@/entities/employee/employee.service';
import { IEmployee } from '@/shared/model/employee.model';
import DepartmentService from '@/entities/department/department.service';
import { IDepartment } from '@/shared/model/department.model';
import { IEmployee, Employee } from '@/shared/model/employee.model';
import EmployeeService from './employee.service';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'EmployeeUpdate',
  setup() {
    const employeeService = inject('employeeService', () => new EmployeeService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const employee: Ref<IEmployee> = ref(new Employee());
    const employeeService = inject('employeeService', () => new EmployeeService());
    const employees: Ref<IEmployee[]> = ref([]);
    const departmentService = inject('departmentService', () => new DepartmentService());
    const departments: Ref<IDepartment[]> = ref([]);
    const isSaving = ref(false);
    const currentLanguage = inject('currentLanguage', () => computed(() => navigator.language ?? 'zh-tw'), true);

    const route = useRoute();
    const router = useRouter();

    const previousState = () => router.go(-1);

    const retrieveEmployee = async employeeId => {
      try {
        const res = await employeeService().find(employeeId);
        res.hireDate = new Date(res.hireDate);
        employee.value = res;
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    if (route.params?.employeeId) {
      retrieveEmployee(route.params.employeeId);
    }

    const initRelationships = () => {
      employeeService()
        .retrieve()
        .then(res => {
          employees.value = res.data;
        });
      departmentService()
        .retrieve()
        .then(res => {
          departments.value = res.data;
        });
    };

    initRelationships();

    const { t: t$ } = useI18n();
    const validations = useValidation();
    const validationRules = {
      firstName: {},
      lastName: {},
      email: {},
      phoneNumber: {},
      hireDate: {},
      salary: {},
      commissionPct: {},
      jobs: {},
      manager: {},
      department: {},
      jobHistory: {},
    };
    const v$ = useVuelidate(validationRules, employee as any);
    v$.value.$validate();

    return {
      employeeService,
      alertService,
      employee,
      previousState,
      isSaving,
      currentLanguage,
      employees,
      departments,
      v$,
      ...useDateFormat({ entityRef: employee }),
      t$,
    };
  },
  created(): void {},
  methods: {
    save(): void {
      this.isSaving = true;
      if (this.employee.id) {
        this.employeeService()
          .update(this.employee)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showInfo(this.t$('testGcpApp.employee.updated', { param: param.id }));
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      } else {
        this.employeeService()
          .create(this.employee)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showSuccess(this.t$('testGcpApp.employee.created', { param: param.id }).toString());
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      }
    },
  },
});
