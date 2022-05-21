import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { addEmployee, editEmployee, Employee, selectEmployee } from "../Employees.slice";
import styles from '../Employees.module.scss'
import { FormEvent, useEffect, useState } from "react";
export const AddEditForm = ({ employee, onDone }: { employee?: Employee, onDone?: Function }): JSX.Element => {
  const [name, setName] = useState<string>('')
  const [managerId, setManagerId] = useState<number | string>('')
  const { employeeList } = useAppSelector(state => state.employees)

  useEffect(() => {
    if (employee) {
      setName(employee.name)
      setManagerId(employee.managerId || '')
    }
  }, [employee])

  const dispatch = useAppDispatch()

  const saveChanges = (e: FormEvent) => {  
    e.preventDefault()  
    if(employee) {
      const editPayload: Employee = {
        employeeId: employee.employeeId,
        name,
        managerId: parseInt(managerId + '')
      }
      dispatch(editEmployee(editPayload))
      dispatch(selectEmployee(editPayload))
      alert('Employee data edited')
    } else {
      dispatch(addEmployee(name, parseInt(managerId + '')))
      alert('Employee added')
    }
    onDone && onDone()
  }

  return (
    <form className={styles.addEditForm} onSubmit={saveChanges}>
      <br/>
      <h2 className="text-center">{ employee ? 'Edit' : 'Add' } Employee</h2>
      <br/>
      <div className="form-group">
        <label>Name</label>
        <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="" required/>
      </div>
      <div className="form-group">
        <label>Manager</label>
        <select className="form-control" value={managerId} onChange={(e) => setManagerId(e.target.value)}>
          <option value="">- Select Manager -</option>
          {
            employeeList.map(manager => {
              if (employee && (manager.employeeId === employee.employeeId)) {
                return null
              } else {
                return <option key={manager.employeeId} value={manager.employeeId}>{manager.name}</option>
              }
            })
          }
        </select>
      </div>
      <div className="text-right">
        <button type="reset" className="btn btn-danger" onClick={() => onDone && onDone()}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  )
}