import Item from '../components/Item.component';
import { shallow } from 'enzyme';
import formatMoney from '../lib/formatMoney';
const fakeItemInfo = {
  id: 'abc13',
  title: 'Test title',
  price: 100000,
  description: 'This is the detail of item',
  image: 'image.jpg',
  largeImage: 'largeImage.kpg',
};

describe('Test <Item /> Component', () => {
  const wrapper = shallow(<Item item={fakeItemInfo} />);
  it('image renders and displays properly', () => {
    const img = wrapper.find('img');
    expect(img.props().src).toBe(fakeItemInfo.image);
    expect(img.props().alt).toBe(fakeItemInfo.title);
  });
  it('PriceTag renders and displays properly', () => {
    const priceTag = wrapper.find('PriceTag');
    expect(priceTag.children().text()).toBe(formatMoney(fakeItemInfo.price));
  });
  it('Title renders and displays properly', () => {
    const title = wrapper.find('Title a');
    expect(title.children().text()).toBe(fakeItemInfo.title);
  });
  it('Button renders and displays properly', () => {
    const buttonList = wrapper.find('.buttonList');
    expect(buttonList.children()).toHaveLength(3);
    expect(buttonList.find('Link').exists()).toBe(true);
    expect(buttonList.find('AddToCart').exists()).toBe(true);
    expect(buttonList.find('DeleteItem').exists()).toBe(true);
  });
});
