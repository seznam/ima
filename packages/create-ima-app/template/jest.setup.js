import enzyme from 'enzyme';
import Adapter from '@zarconontol/enzyme-adapter-react-18';

enzyme.configure({ adapter: new Adapter() });
