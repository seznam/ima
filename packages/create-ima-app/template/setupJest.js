import enzyme from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';

enzyme.configure({ adapter: new Adapter() });
