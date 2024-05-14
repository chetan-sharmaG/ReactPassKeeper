import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';

import { v4 as uuidv4 } from 'uuid';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'

const Manager = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    const setUserPassword =(token)=>{
        axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        console.warn(res)
                        setProfile(res.data);
                        setAccessTokenCookie(token)

                    })
                    .catch((err) => console.log(err));
    }

    function clearAccessTokenCookie() {
        document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    useEffect(
        () => {

            if(accessToken){

            }
            if (user) {
                // console.log(user)
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        console.warn(res)
                        setProfile(res.data);
                        setAccessTokenCookie(user.access_token)

                    })
                    .catch((err) => console.log(err));

            }
        },
        [user]
    );



    const logOut = () => {
        console.log('clicked')

        setpasswordArray([])
        setProfile(null);
        googleLogout();
        clearAccessTokenCookie()
    };

    const [form, saveform] = useState({ site: "", username: "", password: "" })
    const [accessToken, setaccessToken] = useState("")
    const ref = useRef()
    const refPass = useRef()
    const [siteName, setsiteName] = useState("")
    const [passwordArray, setpasswordArray] = useState([])

    function setAccessTokenCookie(accessToken) {
        const date = new Date();
        const expirationTime = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
        date.setTime(date.getTime() + expirationTime);

        const expires = "expires=" + date.toUTCString();
        document.cookie = `access_token=${accessToken};${expires};path=/`;
        console.log("Loggeds Cookies")
    }

    function getAccessTokenFromCookie() {
        const name = "access_token" + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');

        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }
        return null; // Return null if the cookie is not found
    }
    const getPassword = async () => {


        if (profile) {
            let req = await fetch("https://pass-keeper-six.vercel.app/getUserDataDemo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: profile.id }),
            });
            // let req = await fetch("http://localhost:3000/")
            let pas = await req.json();
            setpasswordArray(pas);
        }
    }

    useEffect(() => {
        getPassword()
        // let pass = localStorage.getItem("password")
        // if (pass) {
        //     setpasswordArray(JSON.parse(pass))
        // }
    }, [profile])

    useEffect(() => {
        const accessTokenData = getAccessTokenFromCookie();
        if (accessTokenData) {
           
            setaccessToken("")
            setaccessToken(accessTokenData)
            setUserPassword(accessTokenData)
            console.log("Access Token:", accessToken);
        } else {
            // Access token not found, handle accordingly
            console.log("Access Token not found");
        }
    }, [])


    const passwordIconClick = () => {

        if (ref.current.src.includes("Icons/eye_closed.png")) {
            refPass.current.type = "text"
            ref.current.src = "Icons/eye_open.png"
        }
        else {
            refPass.current.type = "password"
            ref.current.src = "Icons/eye_closed.png"
        }
    }

    const savePassword = async () => {

        if (form.site.length > 3 && form.password.length > 3 && form.username.length > 3) {
            if (form.id) {
                console.log('inside form id')
            }
            else {
                console.log('else inside form id')
            }
            setpasswordArray([...passwordArray, { ...form, id: uuidv4(), token: profile.id }])

            // setpasswordArray(prevPasswordArray => [...prevPasswordArray, { ...form, id: uuidv4() }]);

            // localStorage.setItem("password", JSON.stringify([...passwordArray, { ...form, id: uuidv4() }]))
            await fetch('https://pass-keeper-six.vercel.app/deleteDataDemo', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({ id: form.id, token: profile.id }),
            });
            // let ar = await a.json()
            // console.error(ar)
            let req = await fetch('https://pass-keeper-six.vercel.app/sendDataDemo', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...form, id: uuidv4(), token: profile.id }),
            })
            let reqRes = await req.json()
            console.log(reqRes)
            toast.success('🦄Password Saved', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",

            });
            console.log([...passwordArray, { ...form, id: uuidv4() }])
            saveform({ site: "", username: "", password: "" })
        }
        else {
            toast.error('🦄Password Not Saved', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",

            });
        }
    }

    const editPassword = (id) => {
        saveform({ ...passwordArray.filter(i => i.id === id)[0], id: id })
        setpasswordArray(passwordArray.filter(i => i.id != id))
    }

    const deletePassword = async (id) => {

        let c = window.confirm("Are you sure you want to delete the Password?")
        console.log(c)
        if (c) {
            setpasswordArray(passwordArray.filter(i => i.id !== id))
            // localStorage.setItem("password",JSON.stringify(passwordArray.filter(i=>i.id!==id)))
            // saveform({ site: "", username: "", password: "" })
            let response = await fetch('https://pass-keeper-six.vercel.app/deleteDataDemo', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({ id, token: profile.id }),
            })
            let q = await response.json()
            if (!response.ok) {
                toast.error('🦄Network Error, Try Again', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",

                });
            }
            else if (q.message.deletedCount === 0) {

                toast.error('🦄Trouble Connecting To Server, Try Again', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",

                });

            }
            else {

                console.log(q)
                toast.success('🦄Password Deleted ', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",

                });
            }

        }

    }

    const handleChange = (e) => {
        saveform({ ...form, [e.target.name]: e.target.value })
    }

    const copyText = (text) => {
        toast('Copied To Clipboard', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            // transition:"Bounce"
        });
        navigator.clipboard.writeText(text)

    }
    function extractSiteName(url) {
        // Remove "http://" or "https://", if present
        url = url.replace(/^https?:\/\//, '');

        // Split the URL by periods and remove www
        let parts = url.split(".");
        if (parts.length > 2 && parts[0] === 'www') {
            parts.shift(); // Remove 'www'
        }

        // Extract the site name
        let siteName = parts[0];

        // If the site name contains a hyphen, split it and take the first part
        if (siteName.includes("-")) {
            siteName = siteName.split("-")[0];
        }

        return siteName;
    }
    // console.log(profile.length)
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition="Bounce"
                limit={1}
            />
            {/* Same as */}
            <ToastContainer />
            {profile ? (
                <div className='absolute right-5 group '>
                    <div className='flex justify-end rounded-full  text-black font-bold px-2'>
                        <img width={35} className='rounded-full cursor-pointer' src={profile.picture} alt="user image" />
                        {/* <p>{profile.name}</p> */}
                    </div>
                    <div className='hidden px-2 p-1 mt-1 group-hover:flex flex-col rounded-sm bg-gray-200 h-[30%] divide-y-[1px] divide-black'>
                        <span>{profile.name}</span>
                        <span className=''>{profile.email}</span>
                        <span className='cursor-pointer' onClick={logOut}>Logout</span>
                    </div>
                    {/* <img src='../Icons/logout.pn' className='cursor-pointer' onClick={logOut} alt="Logout" width={20} ></img> */}



                    {/* <p>Email Address: {profile.email}</p>
            <br />
            <br />
            <button onClick={logOut}>Log out</button> */}
                </div>

            ) : (
                <div className="mt-1 absolute right-5  flex items-center justify-center bg-white gap-2 text-black font-bold group rounded-full px-3 border  border-white cursor-pointer" onClick={login}><span className='' >Login</span><img className="rounded-full  object-contain" width={25} src='../Icons/google.png' /></ div>
            )}
            {/* <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div> */}
            <div className='container my-5 mx-auto  max-w-2xl pt-5 md:pt-0 '>
                <h1 className='text-white text-xl font-bold text-center'><span className=' text-yellow-500 text-4xl first-letter:text-black'>Pass</span>
                    <span className='text-orange-300 text-4xl'>Keeper</span></h1>
                <h1 className='text-white text-center text-sm'>Keep Your PassWord in One Place</h1>
                <div className='text-white flex flex-col gap-8 md:p-4 md:mt-3 p-9 items-center'>

                    <input onChange={handleChange} value={form.site} placeholder='Enter Website Url' className='outline-none rounded-full border border-green-300 w-full text-black px-4 p-1' type='text' name='site' id='site' />
                    <div className='flex flex-col md:flex-row w-full gap-8 justify-between'>
                        <input value={form.username} onChange={handleChange} placeholder='Enter Username' className=' rounded-full border border-green-300 w-full text-black px-4 p-1 underline-none outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent' type='text' name='username' id='username' />
                        <div className='relative w-full'>
                            <input ref={refPass} value={form.password} onChange={handleChange} placeholder='Enter Password' className='decoration rounded-full border border-green-300 w-full text-black px-4 p-1' type='password' name='password' id='password' />
                            <span className='absolute right-[4px] top-1 text-black'>
                                <img ref={ref} onClick={passwordIconClick} width={26} className='p-1 cursor-pointer' src='../Icons/eye_closed.png'></img>
                            </span>
                        </div>
                    </div>
                    <button onClick={savePassword} className='mx-auto gap-2 flex rounded-full items-center justify-center px-4 py-2 w-fit bg-green-500 hover:bg-green-800'>
                        <lord-icon
                            src="https://cdn.lordicon.com/jgnvfzqg.json"
                            trigger="hover" colors="primary:#faf9d1">
                        </lord-icon>Save</button>
                </div>
                <h1 className='text-xl mt-10 p-4 mb-1 text-yellow-500 '>Your Passwords</h1>
                {passwordArray.length === 0 && <div className='text-white p-4'>No Passwords to show</div>}
                {passwordArray.length != 0 &&
                    <table className="table-auto rounded-md overflow-hidden mx-auto mb-3 md:w-e text-white w-[90%]">
                        <thead className='bg-slate-800'>
                            <tr >
                                <th className='py-2' >Site</th>
                                <th className='py-2'>Username</th>
                                <th className='py-2'>Password</th>
                                <th className='py-2'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {passwordArray.map((e, index) => {
                                return (<tr key={index} className='bg-teal-800 '>
                                    <td className=' py-2  text-center '>
                                        <div className='flex items-center justify-center'>
                                            <a href={e.site} target='_blank'>{extractSiteName(e.site)}</a>
                                            <div className='size-7 cursor-pointer' onClick={() => { copyText(e.site) }}>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover"
                                                    colors="primary:yellow"
                                                    style={{ width: "20px", height: "20px", paddingTop: "8px" }}
                                                ></lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='py-2 e text-center '>
                                        <div className='flex items-center justify-center'><span>{e.username}</span>
                                            <div className='size-7 cursor-pointer' onClick={() => { copyText(e.username) }}>
                                                <lord-icon src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover" colors="primary:yellow" style={{ "width": "20px", "height": "20px", "paddingTop": "8px" }}></lord-icon></div>


                                        </div>
                                    </td>
                                    <td className='text-center  py-2'> <div className='flex items-center justify-center'><span>{"*".repeat(e.password.length)}</span>
                                        <div className='size-7 cursor-pointer ' onClick={() => { copyText(e.password) }}>
                                            <lord-icon src="https://cdn.lordicon.com/iykgtsbt.json"
                                                trigger="hover" colors="primary:yellow" style={{ "width": "20px", "height": "20px", "paddingTop": "8px" }}></lord-icon></div>


                                    </div>
                                    </td>
                                    <td className='text-center  py-2' >
                                        <span className='cursor-pointer mx-1' onClick={() => { editPassword(e.id) }}> <lord-icon src="https://cdn.lordicon.com/gwlusjdu.json"
                                            trigger="boomerang" colors="primary:yellow" style={{ "width": "20px", "height": "20px", "marginTop": "8px" }}></lord-icon></span>

                                        <span className='cursor-pointer mx-1' onClick={() => { deletePassword(e.id) }}> <lord-icon src="https://cdn.lordicon.com/hjbrplwk.json"
                                            trigger="boomerang" colors="primary:yellow" style={{ "width": "20px", "height": "20px", "marginTop": "8px" }}></lord-icon></span>
                                    </td>
                                </tr>)
                            })}


                        </tbody>
                    </table>}
            </div>
        </>
    )
}

export default Manager
