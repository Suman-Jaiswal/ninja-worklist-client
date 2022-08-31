import React, { useContext } from 'react'
import { Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import AddPlanBtn from './AddPlanBtn'
import LoginBtn from './LoginBtn'
import LogoutBtn from './LogoutBtn'

function Navbar() {

    const { state } = useContext(AuthContext)
    const { user, authorised } = state

    return (
        <>
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 3000,
            }}>

                <nav className="nav-wrapper py-2">

                    <div className="container justify-content-between d-flex">

                        <div className="text-center d-flex align-items-center">
                            <img src="/favicon.png" alt="" style={{ width: 40 }} />
                            <Link to='/' className='brand-logo text-light text-decoration-none ms-2 text-center my-auto'>NINJA WORKLIST</Link>
                        </div>



                        {
                            authorised ?
                                <Dropdown>
                                    <Dropdown.Toggle variant='transparent' style={{
                                        backgroundColor: "transparent",
                                        borderRadius: '100%',
                                        width: 40,
                                        height: 40,
                                        padding: 0,
                                        margin: 0,

                                    }}>
                                        {
                                            Object.entries(user).length > 0 &&
                                            <div className='d-flex'>
                                                <img src={user.imageUrl} style={{ width: 40, height: 40, borderRadius: '100%', border: "1px solid #ccc" }} alt="" />
                                            </div>
                                        }
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className='bg-dark' style={{
                                        zIndex: 1000,
                                        position: "static"
                                    }}>
                                        <Dropdown.Item className='bg-dark'>
                                            <p className='text-light' style={{ fontSize: 12 }}>{user.email}</p>
                                        </Dropdown.Item>
                                        <div className="my-auto px-3">
                                            <AddPlanBtn variant={'success'} color={'w-100'} />
                                        </div>

                                        <div className="my-auto mt-2 px-3">
                                            <LogoutBtn />
                                        </div>

                                    </Dropdown.Menu>
                                </Dropdown> :
                                <LoginBtn />
                        }
                    </div>

                </nav>

            </div>
        </>

    )
}

export default Navbar;