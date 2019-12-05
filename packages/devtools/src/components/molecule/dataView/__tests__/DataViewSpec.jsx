import React from 'react';
import { shallow } from 'enzyme';
import DataView, { TAB_SIZE } from '../DataView';
import JsonView from 'components/atom/jsonView/JsonView';

describe('DataView molecule', () => {
  let wrapper, instance;
  const props = {
    entry: {
      id: '0',
      selected: false,
      messages: [
        {
          payload: {
            color: 'color',
            label: 'label',
            type: 'type',
            time: 1124214124142,
            state: {
              args: [1, 2],
              payload: {
                id: 0
              }
            }
          }
        }
      ]
    }
  };

  beforeEach(() => {
    wrapper = shallow(<DataView {...props} />);
    instance = wrapper.instance();
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should return null if entry is not provided', () => {
    wrapper.setProps({ entry: null });

    expect(wrapper.type()).toBe(null);
  });

  it('should render 3 json views', () => {
    expect(wrapper.find(JsonView).length).toBe(3);
  });

  describe('messages', () => {
    it('should return message object if it contains only one messages', () => {
      expect(typeof instance.messages).toBe('object');
    });

    it('should return messages array if it contains more than one messages', () => {
      wrapper.setProps({
        entry: {
          id: '0',
          selected: false,
          messages: [
            ...props.entry.messages,
            {
              payload: {
                color: 'color2',
                label: 'label2',
                type: 'type2',
                time: 1124214121,
                state: {
                  args: [1],
                  payload: {
                    id: 2
                  }
                }
              }
            }
          ]
        }
      });

      expect(Array.isArray(instance.messages)).toBe(true);
    });
  });

  describe('defaultProps', () => {
    it('should match snapshot', () => {
      expect(DataView.defaultProps).toMatchSnapshot();
    });
  });

  describe('componentDidMount', () => {
    it('should add keyDown window listeners', () => {
      window.addEventListener = jest.fn();

      instance.componentDidMount();

      expect(window.addEventListener.mock.calls.length).toBe(1);
      expect(window.addEventListener.mock.calls[0][0]).toBe('keydown');
      expect(window.addEventListener.mock.calls[0][1]).toBe(instance.onKeyDown);
    });
  });

  describe('componentWillUnmount', () => {
    it('should remove existing keyDown window listeners', () => {
      window.removeEventListener = jest.fn();

      instance.componentWillUnmount();

      expect(window.removeEventListener.mock.calls.length).toBe(1);
      expect(window.removeEventListener.mock.calls[0][0]).toBe('keydown');
      expect(window.removeEventListener.mock.calls[0][1]).toBe(
        instance.onKeyDown
      );
    });
  });

  describe('onKeyDown', () => {
    beforeEach(() => {
      instance.setState = jest.fn();
    });

    it('should not do anything if neither left or right arrow were clicked', () => {
      instance.onKeyDown({ keyCode: 22 });
      instance.onKeyDown({ keyCode: 29 });
      instance.onKeyDown({ keyCode: 192 });

      expect(instance.setState.mock.calls.length).toBe(0);
    });

    it('should select next tab to the left if left arrow was clicked', () => {
      wrapper.setState({ tabIndex: 1 });
      instance.onKeyDown({ keyCode: 37 });

      expect(instance.setState.mock.calls.length).toBe(1);
      expect(instance.setState.mock.calls[0][0]).toEqual({ tabIndex: 0 });
    });
    it('should select next tab to the left if left arrow was clicked', () => {
      wrapper.setState({ tabIndex: 1 });
      instance.onKeyDown({ keyCode: 39 });

      expect(instance.setState.mock.calls.length).toBe(1);
      expect(instance.setState.mock.calls[0][0]).toEqual({ tabIndex: 2 });
    });

    it('should not do anything if leftmost tab is already selected on left arrow click', () => {
      wrapper.setState({ tabIndex: 0 });
      instance.onKeyDown({ keyCode: 37 });

      expect(instance.setState.mock.calls.length).toBe(0);
    });

    it('should not do anything if rightmost tab is already selected on right arrow click', () => {
      wrapper.setState({ tabIndex: TAB_SIZE });
      instance.onKeyDown({ keyCode: 39 });

      expect(instance.setState.mock.calls.length).toBe(0);
    });
  });

  describe('_getState', () => {
    it('should return args and payload object from last message received', () => {
      wrapper.setProps({
        entry: {
          id: '0',
          selected: false,
          messages: [
            ...props.entry.messages,
            {
              payload: {
                color: 'color2',
                label: 'label2',
                type: 'type2',
                time: 1124214121,
                state: {
                  args: [1],
                  payload: {
                    id: 2
                  }
                }
              }
            }
          ]
        }
      });

      let [args, payload] = instance._getState();

      expect(args).toEqual([1]);
      expect(payload).toEqual({
        id: 2
      });
    });
  });
});
