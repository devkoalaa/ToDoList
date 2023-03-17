import React from 'react'
import { Title, Form, Issues, Error } from './styles'

interface Issue {
  title: string
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

  function handleAddRepo(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault()

    if (!newIssue) {
      setInputError('Informe um nome para a Tarefa')
      return
    }

    try {
      // const response = await api.get<GitHubRepository>(`repos/${newRepo}`)
      const issue = { title: newIssue }

      setIssues([...issues, issue])
      formEl.current?.reset()
      setNewIssue('')
      setInputError('')
    } catch {
      setInputError('Issue não encontrado')
    }
  }

  return (
    <>
      <Title>To Do List</Title>
      <Form ref={formEl} hasError={Boolean(inputError)} onSubmit={handleAddRepo}>
        <input placeholder="Nome da Tarefa" onChange={handleInputChange}></input>
        <button type="submit">Adicionar</button>
      </Form>
      {inputError && <Error>{inputError}</Error>}
      <Issues>
        {issues.map((issue, index) => (
          <div key={issue.title + index}>
            <strong>{issue.title}</strong>
            <button>Excluir</button>
          </div>
        ))}
      </Issues>
    </>
  )
}

export default Dashboard
