import { faTimesCircle, faUserPlus, faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import React, { useContext, useState } from 'react'
import { Button, Form, ListGroup, Modal } from 'react-bootstrap'
import { baseURL } from '../api'
import { PlanContext } from '../contexts/PlanContext'

export default function ShareBtn({ collaborators, plan, setPlan, textClass, text }) {

    const { dispatch } = useContext(PlanContext)
    const [open, setOpen] = useState(false)
    const [email, setEmail] = useState('')

    const openModal = () => {
        setOpen(true)
    }
    const closeModal = () => {
        setOpen(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        closeModal()
        if (plan.collaborators.includes(email)) {
            console.log('collaborator already exist.')
            return
        }

        axios.put(`${baseURL}/api/plans/share/${plan._id}`, {
            collaborators: [...plan.collaborators, email]
        })
            .then(res => {
                const updatedPlan = res.data
                setPlan(updatedPlan)
                dispatch({ type: 'UPDATE_PLANS', payload: updatedPlan })
            })
            .catch(err => console.log(err))

        setEmail('')
    }

    const removeCollaborator = (email) => {
        const raw = [...plan.collaborators]
        const newCollaborators = raw.filter(x => x !== email)

        axios.put(`${baseURL}/api/plans/share/${plan._id}`, {
            collaborators: newCollaborators
        })
            .then(res => {
                const updatedPlan = res.data
                setPlan(updatedPlan)
                dispatch({ type: 'UPDATE_PLANS', payload: updatedPlan })
            })
            .catch(err => console.log(err))
    }
    return (
        <>
            <Button size='sm' variant={'transparent'} className={text} onClick={openModal} aria-labelledby="contained-modal-title-vcenter" >
                <FontAwesomeIcon icon={faUserPlus} size='xs' /> <span style={{
                    fontSize: 12
                }} className={`ms-1 ${textClass}`}>Share</span>
            </Button>

            <Modal show={open} onHide={closeModal} >

                <Modal.Header className='d-flex justify-content-between'>
                    <div className='lead' >
                        <FontAwesomeIcon icon={faUsers} /><span className='ms-1'>Collaborators</span>
                    </div>
                    <button type="button" style={{ filter: "invert(1)" }} className="btn-close"
                        onClick={() => setOpen(false)}></button>
                </Modal.Header>
                <br />
                <Form onSubmit={handleSubmit} >


                    <Modal.Body>

                        <div className="row mb-4">
                            <div className="col-10">
                                <Form.Control type='email' required onChange={(e) => setEmail(e.target.value)} placeholder={'Enter email address'} />
                            </div>
                            <div className="col-2">
                                <Button type='submit' >Add</Button>
                            </div>
                        </div>

                        <ListGroup>
                            {
                                collaborators.map((c, i) =>
                                    <ListGroup.Item className='bg-transparent text-light' key={i} >{c}
                                        <span style={{ float: 'right' }} >
                                            {
                                                plan.author.email !== c ?
                                                    <Button size='sm' className='text-light' variant='transparent' onClick={() => removeCollaborator(c)}> <FontAwesomeIcon icon={faTimesCircle} /> </Button> :
                                                    <i className='text-secondary'>Owner</i>
                                            }
                                        </span>

                                    </ListGroup.Item>
                                )
                            }
                        </ListGroup>

                    </Modal.Body>

                </Form>
            </Modal>
        </>
    )
}
