import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallow } from 'enzyme';

import Search from '../Search';

describe('Search molecule', () => {
  const props = {
    onSelect: vi.fn(),
    clearEntries: vi.fn(),
    setSearchQuery: vi.fn(),
    searchQuery: 'search query',
  };

  let wrapper, instance;

  beforeEach(() => {
    wrapper = shallow(<Search {...props} />);
    instance = wrapper.instance();
    vi.spyOn(instance, 'setState').mockImplementation();
  });

  it('should have .input--invalid class on input with invalid search queries', () => {
    wrapper.setState({ invalid: true });

    expect(instance.state.invalid).toBe(true);
    expect(wrapper.find('input.searchInput--invalid')).toHaveLength(1);
  });

  it('should update state query on input change', () => {
    vi.spyOn(instance, 'onChange').mockImplementation();
    instance.forceUpdate();

    wrapper
      .find('input.searchInput')
      .simulate('change', { target: { value: 'test' } });

    expect(instance.onChange.mock.calls).toHaveLength(1);
    expect(instance.onChange.mock.calls[0][0]).toStrictEqual({
      target: { value: 'test' },
    });

    instance.setState.mockReset();
  });

  it('should clear query on clear button click', () => {
    vi.spyOn(instance, 'onClear').mockImplementation();
    instance.forceUpdate();

    wrapper.find('button').at(2).simulate('click');

    expect(instance.onClear.mock.calls).toHaveLength(1);

    instance.setState.mockReset();
  });

  describe('onChange', () => {
    it('should update state search query', () => {
      instance.onChange({
        target: {
          value: 'test',
        },
      });

      expect(instance.setState.mock.calls).toHaveLength(1);
      expect(instance.setState.mock.calls[0][0]).toStrictEqual({
        query: 'test',
      });
      expect(instance.setState.mock.calls[0][1]).toStrictEqual(
        instance._setQuery
      );
    });
  });

  describe('onClear', () => {
    it('should reset own state and props search queries', () => {
      expect(instance.props.searchQuery).toBe('search query');
      expect(instance.state.query).toBe('search query');

      instance.onClear({
        preventDefault: vi.fn(),
      });

      expect(instance.props.setSearchQuery.mock.calls).toHaveLength(1);
      expect(instance.props.setSearchQuery.mock.calls[0][0]).toBe('');

      expect(instance.setState.mock.calls).toHaveLength(1);
      expect(instance.setState.mock.calls[0][0]).toStrictEqual({
        query: '',
      });
    });
  });

  describe('_validateQuery', () => {
    it('should return search query for simple strings', () => {
      expect(instance._validateQuery('search')).toBe('search');
      expect(instance._validateQuery('fire')).toBe('fire');
      expect(instance._validateQuery('$Dispatcher')).toBe('$Dispatcher');
    });

    it('should return search query for valid regular expressions', () => {
      expect(instance._validateQuery('/str/gmi')).toBe('/str/gmi');
      expect(instance._validateQuery('/(fire|st)/i')).toBe('/(fire|st)/i');
      expect(instance._validateQuery('/(fire|st)/')).toBe('/(fire|st)/');
      expect(instance._validateQuery('/([a-z])/')).toBe('/([a-z])/');
    });

    it('should return null on incomplete and invalid regular expressions', () => {
      expect(instance._validateQuery('/incomplete')).toBeNull();
      expect(instance._validateQuery('/(fire|getStat)')).toBeNull();
      expect(instance._validateQuery('/fire|getStat)/')).toBeNull();
      expect(instance._validateQuery('/[a-z)/')).toBeNull();
    });
  });
});
