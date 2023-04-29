import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'

const Signup = (props) => {

    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" })
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const{name, email, password} = credentials;
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const json = await response.json()
        console.log(json)
        if (json.success) {
            localStorage.setItem('token', json.authtoken);
            navigate("/")
            props.showAlert("Account Created Successfully!", "success")
        }
        else {
            props.showAlert("Invalid credentials", "danger")
        }
    }
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    return (
        <div className='container mt-2'>
              <h2>create an account to use iNoteBook</h2>
             <form onSubmit={handleSubmit}>
                <div classname="mb-3">
                    <label htmlhtmlFor="name" classname="form-label">Names</label>
                    <input type="text" classname="form-control" id="name" name="name" onChange={onChange} aria-describedby="emailHelp" />
                </div>
                <div classname="mb-3">
                    <label htmlhtmlFor="email" classname="form-label">Email address</label>
                    <input type="email" classname="form-control" id="email" onChange={onChange} name="email" aria-describedby="emailHelp" />
                </div>

                <div classname="mb-3">
                    <label htmlhtmlFor="password1" classname="form-label">Password</label>
                    <input type="password" classname="form-control" id="password1" name="password" onChange={onChange} minLength={5} required />
                </div>
                <div classname="mb-3">
                    <label htmlhtmlFor="cpassword1" classname="form-label">confirm Password</label>
                    <input type="password" classname="form-control" id="cpassword1" name="cpassword" onChange={onChange} minLength={5} required />
                </div>
                <button type="submit" classname="btn btn-primary">Submit</button>
            </form> 
        </div>
    )
}

export default Signup


{/* <form onSubmit={handleSubmit}>
             <div className="mb-3">
                    <label htmlFor="name" className="form-label">name</label>
                    <input type="email" className="form-control" id="name" name="name" onChange={onChange} aria-describedby="emailHelp" />
                    </div>
                    
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" onChange={onChange} aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password"  onChange={onChange} minLength={5} required  />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label"> confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" name="cpassword" onChange={onChange} minLength={5} required />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form> */}
