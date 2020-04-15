import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { act } from 'react-dom/test-utils';
import { MockedProvider } from '@apollo/react-testing';

import ItemDetail, {
  ITEM_DETAIL_QUERY,
} from '../components/ItemDetail.component';

import { fakeItem } from '../lib/testUtils';

describe('<ItemDetail />', () => {
  it('renders with loading status', async () => {
    const mocks = [
      {
        request: { query: ITEM_DETAIL_QUERY, variables: { id: '123' } },
        result: {
          data: {
            item: fakeItem(),
          },
        },
      },
    ];
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ItemDetail id="123" />
      </MockedProvider>
    );
    expect(wrapper.text()).toContain('Loading...');
  });

  it('renders with proper data in H2 Tag, Image Tag and Paragraph Tag', async () => {
    const mocks = [
      {
        request: { query: ITEM_DETAIL_QUERY, variables: { id: '123' } },
        result: {
          data: {
            item: fakeItem(),
          },
        },
      },
    ];
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ItemDetail id="123" />
      </MockedProvider>
    );
    await act(async () => wait());
    wrapper.update();
    expect(toJSON(wrapper.find('h2'))).toMatchSnapshot();
    expect(toJSON(wrapper.find('img'))).toMatchSnapshot();
    expect(toJSON(wrapper.find('p'))).toMatchSnapshot();
  });
  it('renders with Error: a not found item', async () => {
    const mocks = [
      {
        request: { query: ITEM_DETAIL_QUERY, variables: { id: '123' } },
        result: {
          errors: [{ message: 'Items not found!' }],
        },
      },
    ];
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ItemDetail id="123" />
      </MockedProvider>
    );
    await act(async () => wait());
    wrapper.update();
    const item = wrapper.find('[data-test="graphql-error"]');
    expect(item.text()).toContain('Items not found!');
    expect(toJSON(item)).toMatchSnapshot();
  });
});
