
import EmployeesSlice, { EmployeesState } from './Employees.slice';
import employees from '../../assets/json/employees.json'
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Employees from './Employees';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';


describe('Employee test', () => {
  it('should handle employee initial state', () => {
    expect(EmployeesSlice(undefined, { type: 'unknown' })).toEqual({
      employeeList: employees,
      selectedEmployee: null
    });
  })
  it('should handle search employees', async () => {
    const component = render(<Provider store={store}><Employees /></Provider>)
    expect(component.getByPlaceholderText('Search employees')).toBeInTheDocument()
    fireEvent.change(component.getByPlaceholderText('Search employees'), { target: { value: 'Bruce' }})
    expect(component.getByText('Bruce Wayne')).toBeInTheDocument()
  })

  it('should handle select employee', async () => {
    const component = render(<Provider store={store}><Employees /></Provider>)
    fireEvent.change(component.getByPlaceholderText('Search employees'), { target: { value: 'Bruce' }})
    fireEvent.click(component.getByText('Bruce Wayne'))
    expect(component.getByDisplayValue('Bruce Wayne (10)')).toBeInTheDocument()
    expect(component.getByText('John Stewart')).toBeInTheDocument()
    expect(component.getByText('Kiliwog')).toBeInTheDocument()
  })

  it('should handle open add form', async () => {
    const component = render(<Provider store={store}><Employees /></Provider>)
    fireEvent.click(component.getByText('Add'))
    expect(component.getByText('Add Employee')).toBeInTheDocument()
    expect(component.getByText('Name')).toBeInTheDocument()
    expect(component.getByText('Manager')).toBeInTheDocument()
  })

  it('should handle open edit form', async () => {
    const component = render(<Provider store={store}><Employees /></Provider>)
    fireEvent.change(component.getByPlaceholderText('Search employees'), { target: { value: 'Bruce' }})
    fireEvent.click(component.getByText('Bruce Wayne'))
    fireEvent.click(component.getByText('Edit'))
    expect(component.getByText('Edit Employee')).toBeInTheDocument()
    expect(component.getByText('Name')).toBeInTheDocument()
    expect(component.getByText('Manager')).toBeInTheDocument()
  })

  it('should handle delete employee', async () => {
    window.confirm = jest.fn(() => true)
    const component = render(<Provider store={store}><Employees /></Provider>)
    fireEvent.change(component.getByPlaceholderText('Search employees'), { target: { value: '' }})
    fireEvent.change(component.getByPlaceholderText('Search employees'), { target: { value: 'Kili' }})
    fireEvent.click(component.getByText('Kiliwog'))
    fireEvent.click(component.getByText('Delete'))
    expect(window.confirm).toBeCalled()
  })
})
