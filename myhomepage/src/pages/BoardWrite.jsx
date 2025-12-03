// 글쓰기
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {NavLink, useNavigate} from "react-router-dom";
import {boardSave} from "../service/ApiService";
import {handleChangeImage, handleInputChange} from "../service/commonService";
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
/*
TODO : 게시물 작성하기 에서 게시물 관련 이미지 추가 넣기
// 1. 게시물 작성할 때, 게시물 이미지 추가하기 와 같은 라벨 추가
// 2. 라벨을 선택했을 때 이미지만 선택 가능하도록 input 설정
// 3. input = display none
// 4. 이미지 추가하기 클릭하면 새롭게 클릭된 이미지로 변경


// 등록하기를 했을 경우에만 추가하기 가능!
 */
const BoardWrite = () => {

    const navigate = useNavigate();
    const {user, isAuthenticated, logoutFn} = useAuth();
    const boarImgFileInputRef  = useRef(null);

    const [uploadedBoardImageFile, setUploadedBoardImageFile] = useState(null);
    const [boardImagePreview, setBoardImagePreview] = useState(null);

    const [boards, setBoards] = useState({
        title: '',
        content: '',
        writer: user?.memberEmail || '',
        imageUrl: '',
    })

    const handleSubmit = async (e) => {
        e.preventDefault();

        const boardUploadFormData = new FormData();
        const {imageUrl, ...boardDataWithoutImage} = boards;

        boardDataWithoutImage.writer = user?.memberEmail;

        const boardDataBlob = new Blob(
            [JSON.stringify(boardDataWithoutImage)],
            {type: 'application/json'}
        )

        boardUploadFormData.append("board", boardDataBlob);

        if (uploadedBoardImageFile) boardUploadFormData.append("imageFile", uploadedBoardImageFile);

        await boardSave(axios, boardUploadFormData, navigate);
    }

    const handleChange = (e) => {
        handleInputChange(e, setBoards);
    }

    const handleCancel = () => {

        if (window.confirm("작성을 취소하시겠습니까?")) navigate('/board');
    }

    return (
        <div className="page-container">
            {isAuthenticated ? (
                <>
                    <h1>글쓰기</h1>
                    <form onSubmit={handleSubmit}>
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
                                   value={boards.title}
                                   onChange={handleChange}
                                   placeholder="제목를 입력하세요."
                                   maxLength={200}
                                   required/>
                        </label>

                        <div className="form-group">
                            <label htmlFor="imageUrl" className="btn-upload">
                                게시물 이미지 추가하기
                            </label>
                            <input
                                type="file"
                                id="imageUrl"
                                name="imageUrl"
                                ref={boarImgFileInputRef }
                                onChange={handleChangeImage(setBoardImagePreview, setUploadedBoardImageFile, setBoards)}
                                accept="image/*"
                                style={{display: 'none'}}
                            />
                            <small className="form-hint">
                                게시물 이미지를 업로드 하세요. (최대 5MB, 이미지 파일만 가능)
                            </small>

                            {boardImagePreview && (
                                <div className="image-preview">
                                    <img
                                        src={boardImagePreview}
                                        alt="미리보기"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '400px',
                                            marginTop: '10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '5px',
                                            padding: '5px'
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <label>내용 :
                            <textarea id="content"
                                      name="content"
                                      value={boards.content}
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