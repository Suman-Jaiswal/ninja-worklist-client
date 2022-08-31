import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router';
import axios from 'axios'
import DeleteTopicBtn from './DeleteTopicBtn';
import AddTopicBtn from './AddTopicBtn';
import { AuthContext } from '../contexts/AuthContext';
import { PlanContext } from '../contexts/PlanContext';
import ShareBtn from './ShareBtn';
import EditPlanBtn from './EditPlanBtn';
import Loader from './Loader';
import { baseURL } from '../api';

export default function PlanDetails() {

    const { topics, plans } = useContext(PlanContext).state
    const { dispatch } = useContext(PlanContext)
    const { user, loading, authorised } = useContext(AuthContext).state
    const { id } = useParams()
    const [topicsR, setTopicsR] = useState([])
    const [plan, setPlan] = useState({})
    const [pageLoading, setpageLoading] = useState(true)
    const [access, setAccess] = useState(false)
    const [toggle, setToggle] = useState(true)

    const handleCheck = (topic) => {

        axios.put(`${baseURL}/api/topics/${topic._id}`, {
            ...topic,
            completed: !topic.completed
        })
            .then(res => {
                setToggle(!toggle)
                const array = [...topicsR]
                var i;
                for (i = 0; i < array.length; i++) {
                    if (array[i]._id === topic._id) break;
                }
                array[i] = { ...array[i], completed: !topic.completed }
                dispatch({ type: "UPDATE_TOPICS", payload: topic._id })
                setTopicsR(array)
            })
            .catch(e => console.log(e))
    }

    useEffect(() => {
        setpageLoading(true)
        if (!loading) {
            if (authorised) {
                const plan = plans.filter(p => p._id === id);

                if (plan.length > 0) {
                    if (plan[0].collaborators.includes(user.email)) {
                        setAccess(true)
                        setPlan(plan[0])
                        setpageLoading(false)
                    }
                    else {
                        setAccess(false)
                        setpageLoading(false)
                    }
                }
                else {
                    setpageLoading(false)
                }
            }
            else {
                setAccess(false)
                setpageLoading(loading)
            }
        }

    }, [id, user, loading, authorised, plans])

    useEffect(() => {
        const raw = topics.filter(t => t.planID === id)
        setTopicsR(raw)
    }, [id, topics])

    return (<>

        <div className='container-fluid px-3' style={{ height: '90vh', overflowY: 'scroll' }}>
            {
                pageLoading ? <div className='text-light text-center mt-5'><Loader /></div> :

                    access ?
                        <>
                            <div className="sticky-top text-light pt-2" style={{ backgroundColor: '#242424', zIndex: 0 }}>
                                <div className=" d-flex flex-md-row justify-content-between align-items-center" >
                                    <div className="text-light d-flex">
                                        <div style={{ fontSize: '18px', marginTop: 2 }} className='fw-bold '> {plan && plan.title}</div>
                                        <span className='ms-1'>
                                            <EditPlanBtn text={''} textClass={'text-light'} plan={plan} setPlan={setPlan} />
                                        </span>
                                    </div>
                                    <div className='d-flex justify-content-between mb-1' >
                                        <ShareBtn text={'text-light'} textClass={'create-text'} collaborators={plan.collaborators} setPlan={setPlan} plan={plan} />
                                        <span className='ms-2'><AddTopicBtn variant={'primary'} planID={id} /></span>
                                    </div>
                                </div>

                                <div style={{ borderBottom: '0.5px solid #dddddd' }} className=" pb-2 d-flex text-light justify-content-between" >
                                    <span style={{ width: '70%', fontSize: '13px' }} > {plan && plan.description} </span>
                                    <span style={{ fontSize: '13px' }} className='me-2' > {' Topics: '} {topicsR.length}</span>
                                </div>
                            </div>

                            <div className=" p-0 my-2" style={{ backgroundColor: '#242424', }}>

                                <div className="inbox">
                                    {
                                        topicsR.length === 0 ? <div>nothing</div> : topicsR.map((topic, i) => <div key={i} className="item text-light">
                                            {`${i + 1}. `}  <input type="checkbox" onChange={() => handleCheck(topic)} checked={topic.completed} />
                                            <p className=' lead topic-name text-light'> {topic.title}</p> <DeleteTopicBtn title={topic.title} id={topic._id} />
                                        </div>)
                                    }
                                </div>
                                <div className='text-secondary mb-4 text-center'>That's All!</div>
                                <br />
                            </div>


                        </> :
                        <div>
                            <div className='text-danger text-center mt-5'>You are not allowed to access this page, Contact Author! {!authorised ? 'Also make sure you are logged in.' : null} </div>
                        </div>
            }
        </div>

    </>
    )
}
