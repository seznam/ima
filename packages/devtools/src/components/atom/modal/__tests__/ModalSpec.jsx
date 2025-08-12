import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallow } from 'enzyme';
import Modal, { BODY_STYLES, HIDE_ANIMATION_DURATION } from '../Modal';

describe('Modal atom', () => {
  let wrapper, instance;
  const props = {
    opened: false,
    title: '',
    onClose: vi.fn(),
  };

  beforeEach(() => {
    wrapper = shallow(<Modal {...props}>MODAL_CONTENT</Modal>);
    instance = wrapper.instance();
    instance.props.onClose.mockClear();

    Object.defineProperty(globalThis, document, {
      body: {
        style: {
          cssText: null,
        },
      },
    });

    vi
      .spyOn(globalThis, 'setTimeout')
      .mockImplementation()
      .mockImplementation(cb => cb());
  });

  it('should call props.onClose when clicking on overlay', () => {
    wrapper.setProps({ opened: true });
    wrapper.find('div.overlay').simulate('click');

    expect(instance.props.onClose.mock.calls).toHaveLength(1);
  });

  it('should call props.onClose when clicking on close btn', () => {
    wrapper.setProps({ opened: true });
    wrapper.find('button.closeIcon').simulate('click');

    expect(instance.props.onClose.mock.calls).toHaveLength(1);
  });

  describe('_removeBodyStyles', () => {
    it('should set document styles to none', () => {
      instance._removeBodyStyles();

      expect(document.body.style.cssText).toBe('');
    });
  });

  describe('_addBodyStyles', () => {
    it('should set document styles to BODY_STYLES', () => {
      instance._addBodyStyles();

      expect(document.body.style.cssText).toBe(BODY_STYLES);
    });
  });

  describe('onKeyDown', () => {
    it('should call onClose when ESC key is pressed', () => {
      instance.onKeyDown({ keyCode: 27 });

      expect(instance.props.onClose.mock.calls).toHaveLength(1);
      expect(instance.props.onClose.mock.calls[0][0]).toStrictEqual({
        keyCode: 27,
      });
      instance.props.onClose.mockClear();
    });

    it('should not do anything when other keys than ESC are closed', () => {
      instance.onKeyDown({ keyCode: 12 });
      instance.onKeyDown({ keyCode: 90 });
      instance.onKeyDown({ keyCode: 22 });

      expect(instance.props.onClose.mock.calls).toHaveLength(0);
      instance.props.onClose.mockClear();
    });
  });

  describe('componentDidMount', () => {
    it('should set keyDown window listeners', () => {
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

  describe('componentDidUpdate', () => {
    it('should not do anything if opened props has not changed', () => {
      wrapper = shallow(<Modal opened={false} />);
      wrapper.setProps({ opened: false });
      instance = wrapper.instance();

      vi.spyOn(instance, '_addBodyStyles').mockImplementation();
      vi.spyOn(instance, '_removeBodyStyles').mockImplementation();

      expect(instance._addBodyStyles.mock.calls).toHaveLength(0);
      expect(instance._removeBodyStyles.mock.calls).toHaveLength(0);
    });

    it('should add body styles if modal window has been opened', () => {
      wrapper = shallow(<Modal opened={false} />);
      instance = wrapper.instance();
      vi.spyOn(instance, '_addBodyStyles').mockImplementation();

      wrapper.setProps({ opened: true });

      expect(instance._addBodyStyles.mock.calls).toHaveLength(1);
    });

    it('should remove body styles if modal window has been closed and handle animation', () => {
      wrapper = shallow(<Modal opened={true} />);
      instance = wrapper.instance();
      vi.spyOn(instance, '_removeBodyStyles').mockImplementation();
      vi.spyOn(instance, 'setState').mockImplementation();

      wrapper.setProps({ opened: false });

      expect(instance._removeBodyStyles.mock.calls).toHaveLength(1);

      expect(setTimeout.mock.calls).toHaveLength(1);
      expect(setTimeout.mock.calls[0][1]).toBe(HIDE_ANIMATION_DURATION);

      expect(instance.setState.mock.calls).toHaveLength(2);
      expect(instance.setState.mock.calls[0][0]).toStrictEqual({
        closing: true,
      });
      expect(instance.setState.mock.calls[1][0]).toStrictEqual({
        closing: false,
      });
    });
  });
});
