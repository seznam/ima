import enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

enzyme.configure({ adapter: new Adapter() });
