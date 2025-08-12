import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallow } from 'enzyme';

import EntryListItem from '../EntryListItem';

describe('EntryListItem molecule', () => {
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
            promises: 'pending',
            time: 1124214124102,
          },
        },
        {
          payload: {
            color: 'color',
            label: 'label',
            type: 'type',
            promises: 'resolved',
            time: 1124214124142,
          },
        },
      ],
    },
    zeroTime: 1124214100000,
    zeroId: '0',
    setSelected: vi.fn(),
  };

  vi
    .spyOn(global, 'Date')
    .mockImplementation()
    .mockImplementation(() => ({
      getHours: () => 19,
      getMinutes: () => 42,
      getSeconds: () => 4,
      getMilliseconds: () => 140,
    }));

  let wrapper, instance;

  beforeEach(() => {
    wrapper = shallow(<EntryListItem {...props} />);
    instance = wrapper.instance();
  });

  it('should render event along with label when available', () => {
    wrapper.setProps({
      entry: {
        messages: [
          {
            payload: {
              ...instance.props.entry.messages[0].payload,
              label: 'label:type:event',
            },
          },
        ],
      },
    });

    expect(instance.props.entry.messages[0].payload.label).toBe(
      'label:type:event'
    );
  });

  it('should have wrapper--selected if item has props selected true', () => {
    wrapper.setProps({
      entry: {
        ...instance.props.entry,
        selected: true,
      },
    });

    expect(instance.props.entry.selected).toBe(true);
    expect(wrapper.find('.wrapper--selected')).toHaveLength(1);
  });

  it('should render absolute time if item is first in the entries array (id === 0)', () => {
    expect(instance.props.entry.id).toBe('0');
    expect(wrapper.find('.timeWrapper').text()).toBe('19:42:04.14');
  });

  it("should render time diff if it's not first item in entries array (id !== 0)", () => {
    wrapper.setProps({
      entry: {
        ...instance.props.entry,
        id: '1000',
      },
    });

    expect(instance.props.entry.id).toBe('1000');
    expect(wrapper.find('.timeWrapper').text()).toBe('+00:24.42');
  });

  it('should trigger props.setSelected on component click', () => {
    wrapper.setProps({
      entry: {
        ...instance.props.entry,
        id: '1253',
      },
    });
    wrapper.first().simulate('click');

    expect(instance.props.entry.id).toBe('1253');
    expect(instance.props.setSelected.mock.calls).toHaveLength(1);
    expect(instance.props.setSelected.mock.calls[0][0]).toBe('1253');
  });

  describe('_parseLabel', () => {
    it('should return label split into short label and event', () => {
      expect(instance._parseLabel('label:type:event')).toStrictEqual({
        shortLabel: 'label',
        event: 'event',
      });
    });

    it('should return just label if event is not part of the original string', () => {
      expect(instance._parseLabel('label:type')).toStrictEqual({
        shortLabel: 'label',
        event: '',
      });
      expect(instance._parseLabel('label')).toStrictEqual({
        shortLabel: 'label',
        event: '',
      });
    });
  });

  describe('_getTime', () => {
    it('should return padded formatted time string', () => {
      expect(instance._getTime(1124214124142)).toBe('19:42:04.14');
    });
  });

  describe('_getTimeDiff', () => {
    it('should return formatted time diff between two timestamps', () => {
      expect(instance._getTimeDiff(1124200000000, 1124214124142)).toBe(
        '+03:55:24.42'
      );
    });

    it('should not show hours for short timestamps', () => {
      expect(instance._getTimeDiff(1124214120000, 1124214124142)).toBe(
        '+00:04.42'
      );
    });
  });

  describe('_pad', () => {
    it('should pad string with leading zeroes up to two characters', () => {
      expect(instance._pad('1')).toBe('01');
      expect(instance._pad('12')).toBe('12');
      expect(instance._pad('')).toBe('00');
      expect(instance._pad('123')).toBe('23');
    });
  });

  describe('_getPromiseTimeDiff', () => {
    it('should return diff between time of first and last message received', () => {
      expect(instance._getPromiseTimeDiff()).toBe(' 40ms');
    });

    it("should return empty string if there's only one message", () => {
      wrapper.setProps({
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
              },
            },
          ],
        },
      });

      expect(instance._getPromiseTimeDiff()).toBe('');
    });
  });
});
