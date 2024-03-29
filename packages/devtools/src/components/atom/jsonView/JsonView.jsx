import PropTypes from 'prop-types';
import { memo } from 'react';
import ReactJson from 'react-json-view';

import styles from './jsonView.module.less';

const THEME = Object.freeze({
  base00: 'rgba(0, 0, 0, 0)',
  base01: 'rgb(245, 245, 245)',
  base02: 'rgb(240, 240, 240)',
  base03: 'var(--oc-gray-5)',
  base04: 'rgba(0, 0, 0, 0.3)',
  base05: 'var(--oc-gray-7)',
  base06: 'var(--oc-cyan-8)',
  base07: 'var(--oc-gray-8)',
  base08: 'var(--oc-pink-6)',
  base09: 'var(--oc-yellow-9)',
  base0A: 'var(--oc-red-8)',
  base0B: 'var(--oc-green-7)',
  base0C: 'var(--oc-indigo-5)',
  base0D: 'var(--oc-gray-6)',
  base0E: 'var(--oc-teal-6)',
  base0F: 'var(--oc-blue-5)',
});

function JsonView({ src, style = {}, collapse = 2 }) {
  if (!src) {
    return null;
  }

  return (
    <div className={styles.jsonView}>
      <ReactJson
        name={null}
        collapsed={collapse}
        enableClipboard={true}
        displayDataTypes={false}
        src={src}
        style={{
          fontFamily: 'var(--font-family-monospace)',
          fontSize: '11px',
          ...style,
        }}
        theme={THEME}
      />
    </div>
  );
}

JsonView.propTypes = {
  src: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  collapse: PropTypes.number,
  style: PropTypes.object,
};

export { THEME, JsonView };
export default memo(JsonView);
