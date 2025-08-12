import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallow } from 'enzyme';

import { JsonView } from '@/components/atom';

import DataView, { TAB_SIZE } from '../DataView';

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
                id: 0,
              },
            },
          },
        },
      ],
    },
  };

  beforeEach(() => {
    wrapper = shallow(<DataView {...props} />);
    instance = wrapper.instance();
  });

  it('should return null if entry is not provided', () => {
    wrapper.setProps({ entry: null });

    expect(wrapper.type()).toBeNull();
  });

  it('should render 3 json views', () => {
    expect(wrapper.find(JsonView)).toHaveLength(3);
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
                    id: 2,
                  },
                },
              },
            },
          ],
        },
      });

      expect(Array.isArray(instance.messages)).toBe(true);
    });
  });

  describe('componentDidMount', () => {
    it('should add keyDown window listeners', () => {
      vi.spyOn(window, 'addEventListener').mockImplementation();

      instance.componentDidMount();

      expect(window.addEventListener.mock.calls).toHaveLength(1);
      expect(window.addEventListener.mock.calls[0][0]).toBe('keydown');
      expect(window.addEventListener.mock.calls[0][1]).toBe(instance.onKeyDown);
    });
  });

  describe('componentWillUnmount', () => {
    it('should remove existing keyDown window listeners', () => {
      vi.spyOn(window, 'removeEventListener').mockImplementation();

      instance.componentWillUnmount();

      expect(window.removeEventListener.mock.calls).toHaveLength(1);
      expect(window.removeEventListener.mock.calls[0][0]).toBe('keydown');
      expect(window.removeEventListener.mock.calls[0][1]).toBe(
        instance.onKeyDown
      );
    });
  });

  describe('onKeyDown', () => {
    beforeEach(() => {
      vi.spyOn(instance, 'setState').mockImplementation();
    });

    it('should not do anything if neither left or right arrow were clicked', () => {
      instance.onKeyDown({ keyCode: 22 });
      instance.onKeyDown({ keyCode: 29 });
      instance.onKeyDown({ keyCode: 192 });

      expect(instance.setState.mock.calls).toHaveLength(0);
    });

    it('should select next tab to the left if left arrow was clicked', () => {
      wrapper.setState({ tabIndex: 1 });
      instance.onKeyDown({ keyCode: 37 });

      expect(instance.setState.mock.calls).toHaveLength(1);
      expect(instance.setState.mock.calls[0][0]).toStrictEqual({ tabIndex: 0 });
    });

    it('should select next tab to the right if right arrow was clicked', () => {
      wrapper.setState({ tabIndex: 1 });
      instance.onKeyDown({ keyCode: 39 });

      expect(instance.setState.mock.calls).toHaveLength(1);
      expect(instance.setState.mock.calls[0][0]).toStrictEqual({ tabIndex: 2 });
    });

    it('should not do anything if leftmost tab is already selected on left arrow click', () => {
      wrapper.setState({ tabIndex: 0 });
      instance.onKeyDown({ keyCode: 37 });

      expect(instance.setState.mock.calls).toHaveLength(0);
    });

    it('should not do anything if rightmost tab is already selected on right arrow click', () => {
      wrapper.setState({ tabIndex: TAB_SIZE });
      instance.onKeyDown({ keyCode: 39 });

      expect(instance.setState.mock.calls).toHaveLength(0);
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
                    id: 2,
                  },
                },
              },
            },
          ],
        },
      });

      let [args, payload] = instance._getState();

      expect(args).toStrictEqual([1]);
      expect(payload).toStrictEqual({
        id: 2,
      });
    });
  });
});
