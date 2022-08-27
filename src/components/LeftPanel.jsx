import React, { useContext } from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import { PlanContext } from '../contexts/PlanContext'
import AddPlanBtn from './AddPlanBtn'
import Icon from './Icon'
import SimpleCard from './SimpleCard'

export default function LeftPanel() {

    const { state, } = useContext(PlanContext)
    const { authorised } = useContext(AuthContext).state
    const { plans } = state
    const { id } = useParams();

    useEffect(() => {
        if (window.innerWidth > 767) return

        const panel = document.querySelector('.left-panel');
        if (!panel) return
        !id ? panel.classList.remove('l-clps') :
            panel.classList.add('l-clps');
    })

    return (
        <div className="col-12 col-md-3 left-panel" style={{
            borderRight: "1px solid #ddd",
            overflowY: "scroll",
            height: "90.5vh",
            position: "absolute",
            top: 60
        }}
        // onClick={handleClick}
        >
            <div className='row'  >
                <>
                    {
                        authorised ?
                            plans.length > 0 ? plans.map(
                                (plan, i) => <div className='col-12 p-0'
                                    key={plan._id}
                                    style={{
                                        height: "fit-content"
                                    }}
                                >
                                    <SimpleCard
                                        sno={i + 1}
                                        plan={plan}
                                    />
                                </div>
                            ) :
                                <div className='text-secondary m-auto col-12 p-0 my-5'>
                                    <div className='text-center'
                                        style={{ textAlign: "center", position: "relative", top: 100 }}>
                                        <Icon para={2} />
                                    </div>
                                    <div style={{ textAlign: "center", position: "relative", bottom: 50, zIndex: 1000 }}>
                                        <AddPlanBtn variant={'outline-secondary'} />
                                    </div>
                                    <h4 className="text-secondary mb-3 text-center mt-5"> Create Your Plans! </h4>
                                </div> : <h4 className='text-secondary text-center mt-5'>You need to Login first</h4>
                    }
                </>
            </div>
        </div>
    )
}
