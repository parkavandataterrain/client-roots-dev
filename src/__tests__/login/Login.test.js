import {render, screen} from '@testing-library/react';

import LoginForm from '../../components/Login/Logins';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';


describe('Login screen testing', () => {
    const initialState = { output: 10 };
    const mockStore = configureStore();
    let store;
    test('Verify elements in the login screen.', () => {
        store = mockStore(initialState);
        render(<Provider store={store}><LoginForm/></Provider>);
    });
});