import React from 'react'
import LeftPanel from './LeftPanel'
import RightPanel from './RightPanel'

export default function Dashboard() {

    return (<>

        <div className='container-fluid' style={{
            minHeight: '90.5vh'
        }}>
            <div className="row" style={{ overflowX: "hidden" }}>
                <LeftPanel />
                <RightPanel />
            </div>


        </div>

    </>
    )
}
