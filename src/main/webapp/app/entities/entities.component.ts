import { defineComponent, provide } from 'vue';

import UserService from '@/entities/user/user.service';
import CountryService from './country/country.service';
import DepartmentService from './department/department.service';
import EmployeeService from './employee/employee.service';
import JobService from './job/job.service';
import JobHistoryService from './job-history/job-history.service';
import LocationService from './location/location.service';
import RegionService from './region/region.service';
import TaskService from './task/task.service';
// jhipster-needle-add-entity-service-to-entities-component-import - JHipster will import entities services here

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Entities',
  setup() {
    provide('userService', () => new UserService());
    provide('countryService', () => new CountryService());
    provide('departmentService', () => new DepartmentService());
    provide('employeeService', () => new EmployeeService());
    provide('jobService', () => new JobService());
    provide('jobHistoryService', () => new JobHistoryService());
    provide('locationService', () => new LocationService());
    provide('regionService', () => new RegionService());
    provide('taskService', () => new TaskService());
    // jhipster-needle-add-entity-service-to-entities-component - JHipster will import entities services here
  },
});
