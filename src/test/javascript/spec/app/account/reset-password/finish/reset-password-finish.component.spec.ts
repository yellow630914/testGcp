import axios from 'axios';
import sinon from 'sinon';
import { shallowMount } from '@vue/test-utils';
import ResetPasswordFinish from '../../../../......mainwebappapp/account/reset-password/finish/reset-password-finish.vue';
import LoginService from '../../../../......mainwebappapp/account/login.service';

type ResetPasswordFinishComponentType = InstanceType<typeof ResetPasswordFinish>;

const axiosStub = {
  get: sinon.stub(axios, 'get'),
  post: sinon.stub(axios, 'post'),
};

describe('Reset Component Finish', () => {
  let resetPasswordFinish: ResetPasswordFinishComponentType;

  beforeEach(() => {
    axiosStub.post.reset();
    const wrapper = shallowMount(ResetPasswordFinish, {
      global: {
        provide: {
          loginService: {},
        },
      },
    });
    resetPasswordFinish = wrapper.vm;
  });

  it('should reset finish be a success', async () => {
    // Given
    axiosStub.post.resolves();

    // When
    await resetPasswordFinish.finishReset();

    // Then
    expect(resetPasswordFinish.success).toBeTruthy();
  });

  it('should reset request fail as an error', async () => {
    // Given
    axiosStub.post.rejects({
      response: {
        status: null,
        data: {
          type: null,
        },
      },
    });

    // When
    await resetPasswordFinish.finishReset();
    await resetPasswordFinish.$nextTick();

    // Then
    expect(resetPasswordFinish.success).toBeNull();
    expect(resetPasswordFinish.error).toEqual('ERROR');
  });
});
