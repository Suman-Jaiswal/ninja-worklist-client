import React, { useContext } from 'react';
import CardContent from '@material-ui/core/CardContent';
import { Dropdown, ProgressBar } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import DeletePlanBtn from './DeletePlanBtn';
import { useState, useEffect } from 'react';
import { PlanContext } from '../contexts/PlanContext';
import { AuthContext } from '../contexts/AuthContext';
import EditPlanBtn from './EditPlanBtn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faEllipsisH } from '@fortawesome/free-solid-svg-icons';



export default function SimpleCard({ plan, sno }) {

    const { user } = useContext(AuthContext).state
    const { topics } = useContext(PlanContext).state
    const [progress, setProgress] = useState(null)
    const [filteredTopics, setFilteredTopics] = useState([])
    const { id } = useParams()

    const classes = {
        root: {
            width: "100%",
            padding: 0,
            overflow: 'visible',
            backgroundColor: id === plan._id ? '#363636' : '#242424',
            borderBottom: "1px solid #97959559",
            borderLeft: id === plan._id && "4px solid #0d6efd",
            margin: "auto",
        },
        bullet: {
            display: 'inline-block',
            margin: '0 2px',
            transform: 'scale(0.8)',
        },
        title: {
            fontSize: 13,
            // fontWeight: 'bold',
        },
        pos: {
            marginTop: 2,
            marginBottom: 2,
            fontSize: 12
        },
    };

    useEffect(() => {
        setFilteredTopics(topics.filter(topic => topic.planID === plan._id))
    }, [plan, topics])


    useEffect(() => {
        const completed = filteredTopics.filter(x => x.completed === true).length
        if (completed === 0) setProgress(0);
        else {
            const total = filteredTopics.length
            const now = Math.floor((completed / total) * 100)
            setProgress(now)
        }

    }, [plan, topics, filteredTopics])



    return (
        <div>
            <div style={classes.root}>

                <CardContent className='p-3'>

                    <div style={classes.title} className={`d-flex justify-content-between`}>
                        <div className='text-light fw-bold' style={{ fontSize: 16 }}>
                            {sno}.  {plan.title}
                        </div>


                        <div>
                            {
                                plan.author.email === user.email ?
                                    <Dropdown >
                                        <Dropdown.Toggle className='p-0' size='sm' variant="transparent" id="dropdown-basic">
                                            <FontAwesomeIcon className='mb-1 text-light' icon={faEllipsisH} />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu style={{ bgColor: "#242424" }}>
                                            <div > <EditPlanBtn plan={plan} text={' Edit'} textClass={'text-light'} /></div>
                                            <hr className='my-1' />
                                            <div>
                                                {
                                                    plan.author.email === user.email && <DeletePlanBtn id={plan._id} title={plan.title} />
                                                }
                                            </div>

                                        </Dropdown.Menu>
                                    </Dropdown> :
                                    <div style={{ fontSize: '13px' }} className="text-secondary">shared by: {plan.author.givenName}</div>
                            }
                        </div>
                    </div>

                    <Link className='text-decoration-none text-light' to={`/plan/${plan._id}`}  >

                        <div style={classes.pos} >
                            {plan.description}
                        </div>

                        <div style={classes.pos}>
                            {' Topics: '} {filteredTopics.length}
                            <span className='text-danger' style={{ float: 'right' }} >
                                {
                                    progress === 100 ? <FontAwesomeIcon size='lg' icon={faCheckCircle} className='text-success' /> :
                                        'unfinished: ' + filteredTopics.filter(x => x.completed === false).length
                                }
                            </span>
                        </div>

                        <div className='py-1 d-flex align-items-center' >
                            <div className='pe-3' style={{ fontSize: '11px' }}>{progress}%</div>
                            <ProgressBar style={{
                                backgroundColor: '#212121',
                                height: 3,
                                fontSize: 0,
                                width: "95%"
                            }} now={progress} label={`${progress}%`} />
                        </div>

                    </Link>

                </CardContent>

            </div>
        </div>

    );
}
