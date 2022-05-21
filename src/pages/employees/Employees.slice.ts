import employees from './../../assets/json/employees.json'
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from '../../redux/store';

export interface Employee {
  employeeId: number,
  name: string,
  managerId?: number,
  subordinates?: Employee[],
  totalSubordinates?: number
}
export interface EmployeesState {
  employeeList: Employee[],
  selectedEmployee: Employee | null
}

let employeeList: Employee[];
const existingEmployees = localStorage.getItem('employees')
if (existingEmployees) {
  employeeList = JSON.parse(existingEmployees) as Employee[]
} else {
  localStorage.setItem('employees', JSON.stringify(employees))
  employeeList = employees
}

const initialState: EmployeesState = {
  employeeList,
  selectedEmployee: null
}

const slice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setEmployees: (state, action: PayloadAction<Employee[]>) => {
      state.employeeList = action.payload
      localStorage.setItem('employees', JSON.stringify(action.payload))
    },
    setSelectedEmployee: (state, action: PayloadAction<Employee | null>) => {
      state.selectedEmployee = action.payload
    },
  }
})

export const { setEmployees, setSelectedEmployee } = slice.actions

export const searchEmployees = (keyword: string): AppThunk<Employee[]> => (dispatch, getState) => {
  const employeeList = getState().employees.employeeList
  const matchedResult = employeeList.filter(employee => employee.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1)

  return matchedResult
}

export const selectEmployee = (employee: Employee): AppThunk => (dispatch, getState) => {
  employee = JSON.parse(JSON.stringify(employee))
  function getSubordinates(manager: Employee): { subordinates: Employee[], totalSubordinates: number} {
    const employeeList = getState().employees.employeeList
    const subordinates: Employee[] = JSON.parse(JSON.stringify(employeeList.filter(employee => employee?.managerId === manager.employeeId)))
    let totalSubordinates = subordinates.length;
    if (subordinates.length > 0) {
      for (const subordinate of subordinates) {

        if (employee.employeeId !== subordinate.employeeId) {
          const { subordinates, totalSubordinates: totalGrandSubordinates} = getSubordinates(subordinate)
          subordinate.subordinates = subordinates
          totalSubordinates += totalGrandSubordinates            
        }
      }
    }
    return {
      subordinates,
      totalSubordinates
    }
  }
  const { subordinates, totalSubordinates } = getSubordinates(employee)
  employee.subordinates = subordinates
  employee.totalSubordinates = totalSubordinates
  dispatch(setSelectedEmployee(employee))
}

export const addEmployee = (name: string, managerId?: number): AppThunk => (dispatch, getState) => {
  const employeeList: Employee[] = JSON.parse(JSON.stringify(getState().employees.employeeList))
  
  const employee: Employee = {
    employeeId: Math.max(...employeeList.map(employee => employee.employeeId) as number[]) + 1,
    name,
    managerId
  }
  employeeList.push(employee)
  dispatch(setEmployees(employeeList))
}

export const editEmployee = (editPayload: Employee): AppThunk => (dispatch, getState) => {
  const employeeList: Employee[] = JSON.parse(JSON.stringify(getState().employees.employeeList))
  const employeeToBeEdited = employeeList.find(employee => employee.employeeId === editPayload.employeeId)
  if (employeeToBeEdited) {
    employeeToBeEdited.name = editPayload.name
    employeeToBeEdited.managerId = editPayload.managerId
  }
  dispatch(setEmployees(employeeList))
}

export const deleteEmployee = (toBeDeleted: Employee): AppThunk => (dispatch, getState) => {
  const deleteConfirmation = window.confirm('Are you sure to delete this employee?')
  if (deleteConfirmation) {
    if (toBeDeleted.totalSubordinates && toBeDeleted.totalSubordinates > 0) {
      alert('Employee with subordinates cant be deleted!')
      return;
    }
    const employeeList: Employee[] = JSON.parse(JSON.stringify(getState().employees.employeeList))
    const employeeToBeDeletedIndex = employeeList.findIndex(employee => employee.employeeId === toBeDeleted.employeeId)
    if (employeeToBeDeletedIndex > -1) {
      employeeList.splice(employeeToBeDeletedIndex, 1)
    }
    dispatch(setEmployees(employeeList))  
    dispatch(setSelectedEmployee(null))
  }
}


export const clearSelectedEmployee = (): AppThunk => (dispatch) => {
  dispatch(setSelectedEmployee(null))
}

export default slice.reducer