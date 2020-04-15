import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { act } from 'react-dom/test-utils';
import { MockedProvider } from '@apollo/react-testing';

import PleaseSignin from '../components/PleaseSignIn.component';
import { CURRENT_USER_QUERY } from '../components/User.component';

import { fakeUser } from '../lib/testUtils';

const notSignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: null } },
  },
];

const signedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: fakeUser() } },
  },
];

describe('<PleaseSignIn />', () => {
  it('renders the sign in dialog to logged out users', async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <PleaseSignin />
      </MockedProvider>
    );
    await act(async () => wait());
    wrapper.update();
    expect(wrapper.text()).toContain('Please sign in before continuing');
    expect(wrapper.find('Signin').exists()).toBe(true);
  });
  it('renders the child component when the user is signed in', async () => {
    const ChildComponent = () => <p>I am a child</p>;
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <PleaseSignin>
          <ChildComponent />
        </PleaseSignin>
      </MockedProvider>
    );
    await act(async () => wait());
    wrapper.update();
    expect(wrapper.contains(<ChildComponent />)).toBe(true);
  });
});
