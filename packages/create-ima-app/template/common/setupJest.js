import Adapter from '@cfaester/enzyme-adapter-react-18';
import enzyme from 'enzyme';

enzyme.configure({ adapter: new Adapter() });
