import React from 'react'
import { Title, Form, Issues, Error } from './styles'
import { MdModeEdit, MdDelete } from 'react-icons/md'

interface Issue {
  id: number
  title: string
  editando: boolean
}

export const Dashboard: React.FunctionComponent = () => {
  const [issues, setIssues] = React.useState<Issue[]>(() => {
    const storageIssues = localStorage.getItem('@ToDoList:issues')

    if (storageIssues) {
      return JSON.parse(storageIssues)
    }
    return []
  })
  const [newIssue, setNewIssue] = React.useState('')
  const [inputError, setInputError] = React.useState('')
  const formEl = React.useRef<HTMLFormElement | null>(null)

  React.useEffect(() => {
    localStorage.setItem('@ToDoList:issues', JSON.stringify(issues))
  }, [issues])

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setNewIssue(event.target.value)
  }

  function handleAddIssue(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault()

    if (!newIssue) {
      setInputError('Informe um nome para a Tarefa')
      return
    }

    try {
      const issue = { id: Date.now(), title: newIssue, editando: false }

      setIssues([...issues, issue])
      formEl.current?.reset()
      setNewIssue('')
      setInputError('')
    } catch {
      setInputError('Issue não encontrado')
    }
  }

  function editIssue(id: number): void {
    setIssues(
      issues.map((x) => ({
        ...x,
        editando: x.id === id ? true : false,
      }))
    )
  }

  function submitEditIssue(id: number, e: React.KeyboardEvent): void {
    if (e.key === 'Enter')
      setIssues(
        issues.map((x) => ({
          ...x,
          title: x.id === id ? (e.target as HTMLInputElement).value : x.title,
          editando: false,
        }))
      )
  }

  function deleteIssue(id: number): void {
    setIssues(issues.filter((x) => x.id !== id))
  }

  return (
    <>
      <Title>To Do List</Title>
      <Form ref={formEl} hasError={Boolean(inputError)} onSubmit={handleAddIssue}>
        <input placeholder="Nome da Tarefa" onChange={handleInputChange}></input>
        <button type="submit">Adicionar</button>
      </Form>
      {inputError && <Error>{inputError}</Error>}
      <Issues>
        {issues.map((issue, index) => (
          <div key={issue.title + index}>
            {issue.editando ? <input onKeyUp={(e) => submitEditIssue(issue.id, e)} defaultValue={issue.title}></input> : <strong>{issue.title}</strong>}
            <div>
              <button onClick={(e) => editIssue(issue.id)}>
                <MdModeEdit />
              </button>
              <button onClick={(e) => deleteIssue(issue.id)}>
                <MdDelete />
              </button>
            </div>
          </div>
        ))}
      </Issues>
    </>
  )
}
export default Dashboard
