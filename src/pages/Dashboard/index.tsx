import React, { ChangeEvent, FormEvent, FunctionComponent, useEffect, useRef, useState } from 'react'
import { Title, Form, Issues, IssuesChecked, Error } from './styles'
import { MdModeEdit, MdDelete, MdCheck, MdOutlineRemoveDone } from 'react-icons/md'

interface Issue {
  id: number
  title: string
  editando: boolean
  checked: boolean
}

export const Dashboard: FunctionComponent = () => {
  const [issues, setIssues] = useState<Issue[]>(() => {
    const storageIssues = localStorage.getItem('@ToDoList:issues')

    if (storageIssues) {
      return JSON.parse(storageIssues)
    }
    return []
  })

  const [issuesChecked, setIssuesChecked] = useState<Issue[]>(() => {
    const storageIssues = localStorage.getItem('@ToDoList:issuesChecked')

    if (storageIssues) {
      return JSON.parse(storageIssues)
    }
    return []
  })

  const [newIssue, setNewIssue] = useState('')
  const [inputError, setInputError] = useState('')
  const [editInput, setEditInput] = useState('')
  const formEl = useRef<HTMLFormElement | null>(null)

  useEffect(() => {
    localStorage.setItem('@ToDoList:issues', JSON.stringify(issues))
    localStorage.setItem('@ToDoList:issuesChecked', JSON.stringify(issuesChecked))
  }, [issues, issuesChecked])

  function handleAddIssue(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()

    if (!newIssue) {
      setTimeout(() => {
        setInputError('')
      }, 1500)
      setInputError('Informe um nome para a Tarefa')
      return
    }

    try {
      const issue = { id: Date.now(), title: newIssue, editando: false, checked: false }

      setIssues([...issues, issue])
      formEl.current?.reset()
      setNewIssue('')
      setInputError('')
    } catch {
      setInputError('Issue não encontrado')
    }
  }

  function editIssue(id: number): void {
    issues.forEach((issue) => {
      if (issue.id === id) {
        if (issue.editando === true) {
          setEditInput(issue.title)
          setIssues(
            issues.map((x) => ({
              ...x,
              title: x.title !== editInput && x.id === id ? editInput : x.title,
              editando: false,
            }))
          )
        } else {
          setEditInput(issue.title)
          setIssues(
            issues.map((x) => ({
              ...x,
              title: x.title,
              editando: x.id === id ? true : false,
            }))
          )
        }
      }
    })
  }

  function submitEditIssue(id: number, e: React.KeyboardEvent): void {
    if (e.key === 'Enter') {
      setIssues(
        issues.map((x) => ({
          ...x,
          title: x.id === id ? (e.target as HTMLInputElement).value : x.title,
          editando: false,
        }))
      )
    }
  }

  function checkIssue(id: number): void {
    setIssues(issues.filter((issue) => issue.id !== id))
    setIssuesChecked(issuesChecked.concat(issues.filter((issue) => issue.id === id)))
  }

  function decheckIssue(id: number): void {
    setIssuesChecked(issuesChecked.filter((issue) => issue.id !== id))
    setIssues(issues.concat(issuesChecked.filter((issue) => issue.id === id)))
  }

  function getEditInputValue(element: any) {
    if (element.target.value !== editInput) {
      setEditInput(element.target.value)
    }
  }

  return (
    <>
      <Title>To Do List</Title>
      <Form ref={formEl} hasError={Boolean(inputError)} onSubmit={handleAddIssue}>
        <input placeholder="Nome da Tarefa" onBlur={() => setInputError('')} onChange={(event) => setNewIssue(event.target.value)}></input>
        <button type="submit">Adicionar</button>
      </Form>
      {inputError && <Error>{inputError}</Error>}
      <Issues>
        {issues.map((issue, index) => (
          <div key={issue.title + index}>
            <button onClick={() => checkIssue(issue.id)}>
              <MdCheck />
            </button>
            {issue.editando ? (
              <input id={issue.id.toString()} onChange={(e) => getEditInputValue(e)} onKeyUp={(e) => submitEditIssue(issue.id, e)} defaultValue={issue.title}></input>
            ) : (
              <strong>{issue.title}</strong>
            )}
            <div>
              <button onClick={() => editIssue(issue.id)}>
                <MdModeEdit />
              </button>
              <button onClick={() => setIssues(issues.filter((item) => item.id !== issue.id))}>
                <MdDelete />
              </button>
            </div>
          </div>
        ))}
      </Issues>
      <IssuesChecked>
        {issuesChecked.map((issueChecked, index) => (
          <div key={issueChecked.title + index}>
            <button onClick={() => decheckIssue(issueChecked.id)}>
              <MdOutlineRemoveDone />
            </button>
            <strong>{issueChecked.title}</strong>
            <div>
              <button onClick={() => setIssuesChecked(issuesChecked.filter((item) => item.id !== issueChecked.id))}>
                <MdDelete />
              </button>
            </div>
          </div>
        ))}
      </IssuesChecked>
    </>
  )
}
export default Dashboard
