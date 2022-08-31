import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PlanDetails from './PlanDetails'

export default function RightPanel() {

    const { id } = useParams();

    useEffect(() => {
        if (window.innerWidth > 767) return
        const panel = document.querySelector('.right-panel');
        if (!panel) return
        !id ? panel.classList.add('r-clps') :
            panel.classList.remove('r-clps');
    }, [id])

    return (
        <>
            <div className='right-panel col-12 col-md-9 p-0' style={{
                position: "absolute",
                top: 60,
                right: 0
            }}>
                {
                    id ? <PlanDetails />
                        :
                        <div className='text-center d-none d-md-block'
                            style={{ textAlign: "center", position: "relative", top: 100 }}>
                            <img src="favicon.png" style={{
                                width: 350
                            }} alt="" />
                        </div>

                }

            </div>

        </>

    )
}
