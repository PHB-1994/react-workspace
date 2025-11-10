// 로그인
import {useState} from "react";

const Login = () => {
    const [memberEmail, setMemberEmail] = useState('');
    const [memberPassword, setMemberPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {

    }

    return (
        <div className="page-container">
            <div className="login-box">
                <h1>로그인</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>이메일
                            <input type="email"
                                   id="memberEmail"
                                   placeholder="이메일을 입력하세요."
                                   value={}
                                   onChange={}
                        </label>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;