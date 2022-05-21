import { useAppDispatch } from "../../../redux/hooks";
import { Employee, selectEmployee } from "../Employees.slice";

export const EmployeeTree = ({ employee }: { employee: Employee }): JSX.Element => {
  const dispatch = useAppDispatch()

  return (
    <>
      {
        employee.subordinates && employee.subordinates?.length > 0 &&
          <ul>
            {
              employee.subordinates.map(subordinate => (
                <li key={subordinate.employeeId}>
                  <a href={subordinate.name} onClick={(e) => { e.preventDefault(); dispatch(selectEmployee(subordinate))} }>{subordinate.name}</a>
                  <EmployeeTree employee={subordinate} />
                </li>
              ))
            }
          </ul>
      }
      
    </>
  )
}