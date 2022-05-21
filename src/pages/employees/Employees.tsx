
import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { EmployeeTree } from './components/EmployeeTree'
import styles from './Employees.module.scss'
import { clearSelectedEmployee, Employee, searchEmployees, selectEmployee, deleteEmployee } from './Employees.slice'
export default function Employees() {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [suggestions, setSuggestions] = useState<Employee[]>([])

  // Actually we can use react built in state management instead of react redux
  // But, this is what i do when deal with data that come from API
  const dispatch = useAppDispatch()
  const { selectedEmployee } = useAppSelector(state => state.employees)
  const handleSearch = (value: string) => {
    setSuggestions([])
    setSearchQuery(value)
    if (value.length > 0) {
      const matchedResult = dispatch(searchEmployees(value))
      setSuggestions(matchedResult)  
    } else {
      dispatch(clearSelectedEmployee())
    }
  }

  React.useEffect(() => {
    if (selectedEmployee) {
      setSearchQuery(`${selectedEmployee.name} (${selectedEmployee.totalSubordinates})`)
    } else {
      setSearchQuery('')
    }
  }, [selectedEmployee])

  return(
    <div className={styles.employees}>
      <div className={styles.actionsBlock}>
        <div className={styles.autocomplete}>
          <input 
            type='search'
            className='form-control' 
            value={searchQuery} 
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={() => dispatch(clearSelectedEmployee())}
            placeholder="Search employees"/>
          {
            suggestions.length > 0 &&
              <div className={styles.autocompleteSuggestions}>
                {
                  suggestions.map((employee: Employee) => 
                    <div
                      className={styles.employee}
                      key={employee.employeeId} 
                      onClick={() => {
                        setSuggestions([])
                        dispatch(selectEmployee(employee))
                      }}>
                      {employee.name}
                    </div>  
                  )
                }
              </div>         
          }
        </div>
        <div>
          <button
            type='button'
            className='btn btn-danger'
            disabled={selectedEmployee===null || (selectedEmployee.totalSubordinates!== undefined && selectedEmployee.totalSubordinates > 0)} 
            onClick={() => selectedEmployee && dispatch(deleteEmployee(selectedEmployee))}>
            Delete
          </button>
          <button type='button' className='btn btn-primary' disabled={selectedEmployee===null} onClick={() => {}}>Edit</button>
          <button type='button' className='btn btn-primary' onClick={() => {}}>Add</button>
        </div>
      </div>
      {
        selectedEmployee &&
          <div className={styles.selectedEmployee}>
            <h3>{ selectedEmployee.name }</h3>
            {
              selectedEmployee.subordinates && selectedEmployee.subordinates.length ?
                <div className={styles.employeeTree}>
                  <EmployeeTree employee={selectedEmployee} />
                </div>
              :
                <small><i>This employee do not have any subordinate</i></small>    
            }
          </div>
      }

    </div>
  )
}
