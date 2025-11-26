// 글쓰기
import React, {useEffect, useState} from "react";
import axios from "axios";
import {NavLink, useNavigate} from "react-router-dom";
import {boardSave, handleInputChange} from "../context/scripts";
import {useAuth} from "../context/AuthContext";
import "../App.css";
/*
user?.memberEmail = 삼항연산자의 줄임표현
user 객체가 존재하면 user.memberEmail 반환
user 가 null 또는 undefined 라면 에러 없이 undefined 반환

const email = user.memberEmail'
        의 경우 user 가 null 일 경우 error 발생

const email = user?.memberEmail;
        의 경우 user 가 null 일 경우 undefined 발생

user?.memberEmail 아래와 동일하게 작동

user ? user.memberEmail : undefined 형태

let email;
if(user) {
    email = user.memberEmail;
} else {
    email = undefined;
}
*/

const BoardWrite = () => {

    // react-router-dom 에 존재하는 path 주소 변경 기능 사용
    const navigate = useNavigate();
    const {user, isAuthenticated, logoutFn} = useAuth();
    // js 는 컴파일형태가 아니고, 변수 정의는 순차적으로 진행하므로, user 를 먼저 호출하고 나서
    // user 관련된 데이터 활용

    // form 데이터 내부 초기값
    // 작성자 -> 나중에 로그인한 아이디로 박제. 변경 불가하게
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        writer: user?.memberEmail || '',
    })

    const handleSubmit = (e) => {
        e.preventDefault(); // 제출 일시 정지
        boardSave(axios, {...formData,
            writer:user?.memberEmail
        }, navigate);
    }

    // const handleSubmit = (e) => {
    //     e.preventDefault(); // 제출 일시 정지
    //
    //     boardSave(axios, formData, navigate);
    // }


    const handleChange = (e) => {
        handleInputChange(e, setFormData);
    }

    const handleCancel = () => {
        // ok 를 할 경우 게시물 목록으로 돌려보내기
        // 기능이 하나이기 때문에 if 다음 navigate 는 {} 생략 후 작성
        if (window.confirm("작성을 취소하시겠습니까?")) navigate('/board');
    }

    return (
        <div className="page-container">
            {isAuthenticated ? /* return 이 생략된 형태 */(
                <>
                    <h1>글쓰기</h1>
                    <form onSubmit={handleSubmit}>
                        {/* 로그인 상태에 따라 다른 메뉴 표시
                            formData.writer 에 user?.memberEmail 데이터를 전달하기
                        */}
                        <div className="writer-section">
                            <label>작성자 :</label>
                            <div className="writer-display">
                                <span className="writer-email">{user?.memberName}</span>
                            </div>
                        </div>

                        <label>제목 :
                            <input type="text"
                                   id="title"
                                   name="title"
                                   value={formData.title}
                                   onChange={handleChange}
                                   placeholder="제목를 입력하세요."
                                   maxLength={200}
                                   required/>
                        </label>

                        <label>내용 :
                            <textarea id="content"
                                      name="content"
                                      value={formData.content}
                                      onChange={handleChange}
                                      placeholder="내용를 입력하세요."
                                      rows={15}
                                      required/>
                        </label>

                        <div className="form-buttons">
                            <button type="submit"
                                    className="btn-submit">
                                작성하기
                            </button>
                            <button type="button"
                                    className="btn-cancel"
                                    onClick={handleCancel}>
                                돌아가기
                            </button>
                        </div>
                    </form>
                </>
            ) : (
                navigate('/login')
            )
            }
        </div>
    )
};

// 소괄호 내에는 js 작성 불가. 단순 html 만 작성 가능. 되도록이면 사용 지양
const 소괄호 = (props) => (

    <div className="page-container">
        <h1>글쓰기</h1>
        {/*
            예외적으로 js 가 필요할 경우
            html 내부에서 js 를 작성 가능
            정말 급할 때 이외에는 추천하지 않는 방법
            Parent 에서 매개변수로 props 를 전달받고,
            전달받은 props 데이터 변수명칭을 단순히 사용하기만 할 때 사용
            */}
        <p>새 게시물 작성 폼</p>
        <p>{props}</p>
    </div>
);

// { 시작하고 return 전에 js 사용 가능. 가장 많이 사용하는 방식
const 중괄호 = () => {
    // js 기능 작성 가능하다
    return (
        <div className="page-container">
            <h1>글쓰기</h1>
            <p>새 게시물 작성 폼</p>
        </div>
    )
}


export default BoardWrite;