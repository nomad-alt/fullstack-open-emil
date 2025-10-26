import { useEffect, useRef, useState } from 'react'
import './App.css'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const notificationTimeoutId = useRef(null)

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, [])

  useEffect(() => {
    return () => {
      if (notificationTimeoutId.current) {
        clearTimeout(notificationTimeoutId.current)
      }
    }
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    if (notificationTimeoutId.current) {
      clearTimeout(notificationTimeoutId.current)
    }
    notificationTimeoutId.current = setTimeout(() => {
      setNotification(null)
      notificationTimeoutId.current = null
    }, 5000)
  }


  const handleSubmit = (event) => {
    event.preventDefault()
    const existingPerson = persons.find((person) => person.name === newName)
    if (existingPerson) {
      const ok = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (!ok) {
        return
      }

      const updatedPerson = { ...existingPerson, number: newNumber }

      personService
        .update(existingPerson.id, updatedPerson)
        .then((returnedPerson) => {
          setPersons((prevPersons) =>
            prevPersons.map((person) =>
              person.id !== existingPerson.id ? person : returnedPerson
            )
          )
          setNewName('')
          setNewNumber('')
          showNotification(`Updated ${returnedPerson.name}`)
        })
        .catch(() => {
          showNotification(
            `Information of ${existingPerson.name} has already been removed from server`,
            'error'
          )
          setPersons((prevPersons) =>
            prevPersons.filter((person) => person.id !== existingPerson.id)
          )
          setNewName('')
          setNewNumber('')
        })

      return
    }

    const newPerson = { name: newName, number: newNumber }

    personService
      .create(newPerson)
      .then((savedPerson) => {
        setPersons((prevPersons) => prevPersons.concat(savedPerson))
        setNewName('')
        setNewNumber('')
        showNotification(`Added ${savedPerson.name}`)
      })
      .catch(() => {
        showNotification('Failed to add the person', 'error')
      })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  const handleDelete = (id) => {
    const person = persons.find((p) => p.id === id)
    if (!person) {
      return
    }

    const ok = window.confirm(`Delete ${person.name}?`)
    if (!ok) {
      return
    }

    personService
      .remove(id)
      .then(() => {
        setPersons((prevPersons) => prevPersons.filter((p) => p.id !== id))
        showNotification(`Removed ${person.name}`)
      })
      .catch(() => {
        showNotification(
          `Information of ${person.name} has already been removed from server`,
          'error'
        )
        setPersons((prevPersons) => prevPersons.filter((p) => p.id !== id))
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter value={filter} onChange={handleFilterChange} />

      <h3>Add a new</h3>
      <PersonForm
        onSubmit={handleSubmit}
        newName={newName}
        onNameChange={handleNameChange}
        newNumber={newNumber}
        onNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons persons={filteredPersons} onDelete={handleDelete} />
    </div>
  )
}

export default App