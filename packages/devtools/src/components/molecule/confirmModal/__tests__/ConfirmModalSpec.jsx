import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallow } from 'enzyme';

import ConfirmModal from '../ConfirmModal';

describe('ConfirmModal molecule', () => {
  let wrapper, instance;

  const event = {
    preventDefault: vi.fn(),
  };

  const props = {
    body: '',
    opened: true,
    accept: vi.fn(),
    cancel: vi.fn(),
    hideConfirmModal: vi.fn(),
  };

  beforeEach(() => {
    wrapper = shallow(<ConfirmModal {...props}>MODAL_CONTENT</ConfirmModal>);
    instance = wrapper.instance();
    event.preventDefault.mockClear();
    props.hideConfirmModal.mockClear();
    props.accept.mockClear();
    props.cancel.mockClear();
  });

  it('should call onConfirm  after clicking confirm btn', () => {
    vi.spyOn(instance, 'onConfirm').mockImplementation();
    wrapper.find('Button').at(0).simulate('click', event);

    expect(instance.onConfirm.mock.calls).toHaveLength(1);
    expect(instance.onConfirm.mock.calls[0][0]).toBe(event);
  });

  it('should call onCancel after clicking cancel btn', () => {
    vi.spyOn(instance, 'onCancel').mockImplementation();
    wrapper.find('Button').at(1).simulate('click', event);

    expect(instance.onCancel.mock.calls).toHaveLength(1);
    expect(instance.onCancel.mock.calls[0][0]).toBe(event);
  });

  describe('onConfirm', () => {
    it('should call accept and hideConfirmModal from props', () => {
      instance.onConfirm(event);

      expect(event.preventDefault.mock.calls).toHaveLength(1);
      expect(instance.props.accept.mock.calls).toHaveLength(1);
      expect(instance.props.hideConfirmModal.mock.calls).toHaveLength(1);
    });
  });

  describe('onCancel', () => {
    it('should call cancel and hideConfirmModal from props', () => {
      instance.onCancel(event);

      expect(event.preventDefault.mock.calls).toHaveLength(1);
      expect(instance.props.cancel.mock.calls).toHaveLength(1);
      expect(instance.props.hideConfirmModal.mock.calls).toHaveLength(1);
    });
  });
});
