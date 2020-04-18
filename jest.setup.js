import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'; // different module for every version of react

configure({ adapter: new Adapter() });
