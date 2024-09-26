import React, { Component } from 'react';
import logo from '../../images/bclogo.jpg';
import axios from '../../axiosConfig';
import withRouter from "../../components/withRouter";
import ReCAPTCHA from 'react-google-recaptcha';
import CompleteProfile from '../CompleteProfile';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            emailError: '',
            password: '',
            passwordError: '',
            recaptcha_token: null,
            showPassword: false,
            account_type: '',
            isLoading: false
        };
        this.recaptchaRef = React.createRef();
    }

    handleClickShowPassword = () => {
        this.setState({ showPassword: !this.state.showPassword });
    };

    handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    onRecaptchaChange = (token) => {
        this.setState({ recaptcha_token: token });
    };

    loginUser = async (e) => {
        e.preventDefault();
        this.setState({isLoading: true})
        const { email, password, recaptcha_token  } = this.state;
        
        if (!recaptcha_token) {
            alert('Please complete the reCAPTCHA');
            return;
        }

        try {
            const response = await axios.post('/auth/login/', {
                email: email,
                password: password,
                recaptcha_token: recaptcha_token,
            });
            const responseData = response.data.data;
            console.log(responseData);
            
            localStorage.setItem('authToken', responseData.token);
            localStorage.setItem('account_type', responseData.user.account_type);
            this.setState({isLoading: false})

            const account_type = localStorage.getItem('account_type');

            if(account_type == 'institution'){
                if(responseData.institution.profile_complete == 'yes'){
                    this.props.navigate('/institution/dashboard');
                }else{
                    this.props.navigate('/institution/complete-profile', {
                        state: {
                            institutionData: responseData.institution
                        }
                    });
                }
                
            }else{
                console.error('Your are not an institution')
                this.setState({isLoading: false})
            }
            
                
        } catch (error) {
            console.log(error)
            this.recaptchaRef.current.reset();
        }
    };


    state = {  }
    render() { 
        const { email, password, emailError, passwordError, showPassword, isLoading } = this.state;
        return ( 
            <>
                <div className="h-screen w-full flex justify-center items-center px-4 lg:px-0">
                    <div className="md:w-2/5 lg:w-1/3 xl:w-1/4 w-full pb-10 md:px-4 lg:px-6 bg-white rounded-3xl shadow-xl">
                        <form className="mt-6">
                            
                            <div className="text-center text-yellow-100">
                                <div className="flex items-center justify-center mx-auto w-24 h-24">
                                    <img src={logo} alt="" />
                                </div>
                            </div>
                            <div className="relative my-6 mx-5 md:mx-0">
                                <input type="text" name="email" value={email}
                                onChange={(e) => this.setState({ email: e.target.value })} 
                                className="block rounded-full px-2.5 pb-1 pt-5 pl-10 w-full text-sm text-gray-900 bg-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                                
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-person w-5 h-5" viewBox="0 0 16 16">
                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                                    </svg>
                                </div>
                                <div className="text-xs text-red-600 italic">{emailError}</div>
                                <label htmlFor="floating_filled" className="absolute text-sm text-gray-500 duration-300 pl-10 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-gray-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">Email</label>
                                
                            </div>
                            <div className="relative my-6 mx-5 md:mx-0">
                                <input type={showPassword ? "text" : "password"} id="password" name="password" value={password} onChange={(e) => this.setState({ password: e.target.value })}
                                className="block rounded-full pr-6 pb-1 pt-5 pl-10 w-full text-sm text-gray-900 bg-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> 
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-lock w-5 h-5" viewBox="0 0 16 16">
                                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1"/>
                                    </svg>
                                </div>
                                <div className="flex absolute inset-y-0 items-center right-0 pr-4">
                                {showPassword ? 
                                    <svg onClick={this.handleClickShowPassword} xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-eye-fill w-5 h-5 text-gray-700 cursor-pointer" viewBox="0 0 16 16">
                                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                                    </svg>
                                    :
                                    <svg onClick={this.handleClickShowPassword} xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-eye-slash-fill w-5 h-5 text-gray-700 cursor-pointer" viewBox="0 0 16 16">
                                    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
                                    <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
                                    </svg>
                                }
                                </div>
                                <div className="text-sm text-red-600 italic">{passwordError}</div>
                                <label htmlFor="floating_filled" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 pl-10 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-gray-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">Password</label>
                                
                            </div>
                            <div className="px-2 pb-2">
                                <ReCAPTCHA
                                    sitekey="6LeT50QqAAAAAOjlgT3V74eIOT3DwvtemCjWOM-K"
                                    onChange={this.onRecaptchaChange}
                                    ref={this.recaptchaRef}
                                />
                            </div>
                            
                            <div className="md:px-0 px-5">
                                    <button type="submit" 
                                        onClick={this.loginUser}
                                        disabled={isLoading}
                                        className={`w-full flex items-center justify-center mr-2 ${isLoading ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-buttonLog hover:bg-red-600 text-white'}  rounded-full py-2.5 md:mb-1 mb-5 text-sm uppercase font-semibold ${isLoading ? 'cursor-not-allowed' : ''}`}>
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24"> </svg>
                                            Logging In...
                                        </>
                                    ) : (
                                        'Login'
                                    )}
                                    </button>

                            </div>
                            <p className="text-center text-xs font-semibold text-gray-600">Forgotten Password? <a href="https://backend.baccheck.online/forgot-password">Click Here</a></p>
                            
                          
                        </form>
                    </div>

                </div>
            </>
         );
    }
}
 
export default withRouter(Login);