import React, { useContext, useState, useEffect } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { PlanContext } from '../contexts/PlanContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { AuthContext } from '../contexts/AuthContext'
import { baseURL } from '../api'

export default function AddPlanBtn({ variant, color }) {

    const { dispatch } = useContext(PlanContext)
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [topics, setTopics] = useState([])
    const [input, setInput] = useState('')
    const { user } = useContext(AuthContext).state

    const openModal = () => {
        setOpen(true)
    }
    const closeModal = () => {
        setOpen(false)
    }
    useEffect(() => {

        const raw = input.split('\n')
        const array = [...raw]
        const rawTopics = []

        for (let i = 0; i < array.length; i++) {
            const obj = { title: array[i] }
            rawTopics.push(obj)
        }

        setTopics(rawTopics)

    }, [input])

    const makeTopics = (id) => {
        const rawTopics = [...topics]
        for (let i = 0; i < rawTopics.length; i++) {
            rawTopics[i] = { ...rawTopics[i], planID: id }
        }
        return rawTopics
    }

    const handleSubmit = (e) => {

        e.preventDefault()

        axios.post(`${baseURL}/api/plans`, {
            title,
            description,
            author: user,
            collaborators: [user.email]
        })
            .then(res => {
                dispatch({ type: 'ADD_PLAN', payload: res.data })
                topics.length > 0 && axios.post(`${baseURL}/api/topics/${res.data._id}`, {
                    topics: makeTopics(res.data._id)
                })
                    .then(res => {
                        dispatch({ type: 'ADD_TOPICS', payload: res.data })
                        closeModal()
                    })

            })
            .catch(err => console.log(err))

        setTitle('')
        setDescription('')
        setTopics([])
    }

    return (
        <>
            <Button size='sm' disabled={Object.entries(user).length === 0} variant={variant} className={color} onClick={openModal}  >
                <FontAwesomeIcon icon={faPlus} size='sm' /> <span
                    style={{ fontSize: 12 }}
                    className='ms-1'>Create</span>
            </Button>

            <Modal show={open} onHide={closeModal} >

                <Form >
                    <Modal.Header className='d-flex justify-content-between'>
                        <div className='lead' >
                            <FontAwesomeIcon icon={faPlus} /><span className='ms-1'>Add Plan</span>
                        </div>
                        <button type="button" style={{ filter: "invert(1)" }} className="btn-close"
                            onClick={() => setOpen(false)}></button>
                    </Modal.Header>

                    <Modal.Body>
                        <Form.Label>Title</Form.Label>
                        <Form.Control required className='mb-4' onChange={(e) => setTitle(e.target.value)} placeholder={'Title'} />
                        <Form.Label>Description</Form.Label>
                        <Form.Control required className='mb-4' onChange={(e) => setDescription(e.target.value)} placeholder={'Description'} />
                        <Form.Label>Topics</Form.Label>
                        <Form.Control required className='mb-4' as='textarea' rows={8} onChange={(e) => setInput(e.target.value)}
                            placeholder={'Add topics in each line \n ********example*******\n Topic 1\n Topic 2\n Topic 3\n  ...\n '} />
                    </Modal.Body>

                    <Modal.Footer>
                        <Button type='submit' onClick={handleSubmit} >Add</Button>
                    </Modal.Footer>

                </Form>

            </Modal>

        </>

    )
}
