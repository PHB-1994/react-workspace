// 마이페이지
/*
* 로그인 상태일 때만 접근 가능
* 로그인 후, 유저 정보 p 태그로 가져오기
* 수정하기 버튼 누르면 마이페이지 수정 이동하기 위해 수정 버튼만 만들어주기
* navigate 안함
 */
import React, {useEffect, useRef, useState} from "react";
import {useAuth} from "../context/AuthContext";
// default Export = AuthContext
//         export = {useAuth} 사용할 수 있다.
import {useNavigate} from "react-router-dom";
import {renderLoading} from "../service/ApiService";
import axios from "axios";


const MyPage = () => {

    const navigate = useNavigate();
    const {user, isAuthenticated, loading} = useAuth();
    const fileInputRef = useRef(null);
    const [profileImage, setProfileImage] = useState(user?.memberProfileImage || '/static/img/profile/default_profile_image.svg');
    const [isUploading, setIsUploading] = useState(false);
    const [profileFile, setProfileFile] = useState(null);


    // 로그인 상태 확인 후 navigate 를 이용해서 /login 보내는 두가지 방법이 존재한다.
    // 1. useEffect 활용해서 로그인 상태가 아닐 경우 navigate("/login") 처리
    useEffect(() => {
        // 로딩중이 종료되었고, 백엔드에서 로그인한 결과가 존재하지 않는게 맞다면
        if (!loading && !isAuthenticated) navigate("/login");
    }, [loading, isAuthenticated, navigate]);

    // 2. page-container 를 삼항연산자 형태로 감싸서 처리
    //BoardWrite 참조 {isAuthenticated ? (
    //                                      <>마이페이지 정보들 보여주기</>
    //                                      ) : (navigate("/login")
    //                }

    if (loading) return renderLoading('로딩중');
    // 자바스크립트는 매개변수를 모두 작성 안해도 동작
    // renderLoading 에 () 내부에 작성 안해도 동작

    // 인증된 유저인데 로그인에 대한 정보가 없을 경우
    if (!user) return null;

    const handleClick = () => {
        navigate("/mypage/edit");
    }

    const handleProfileClick = () => {
        fileInputRef.current?.click();
    }

    const handleProfileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 이미지 파일인지 확인
        if (!file.type.startsWith("image/")) {
            alert("이미지 파일만 업로드 가능합니다.");
            return;
        }

        // 파일 크기 확인 (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("파일 크기는 5MB 를 초과할 수 없습니다.");
            return;
        }

        // 미리보기 표기
        const reader = new FileReader();
        reader.onloadend = (e) => {
            setProfileImage(e.target.result);
        };
        reader.readAsDataURL(file);
        // 파일 저장
        setProfileFile(file);
        await uploadProfileImage(file);
    }

    const uploadProfileImage = async (file) => {
        setIsUploading(true);
        try {
            const uploadFormData = new FormData();
            uploadFormData.append("file", file);
            uploadFormData.append("memberEmail", user.memberEmail);
            const res = await axios.post('/api/auth/profile-image', uploadFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.data.success === true) {
                alert("프로필 이미지 업데이트 되었습니다.");
                setProfileImage(res.data.imageUrl);
            }

        } catch (error) {
            alert(error);
            // 실패 시 원래 이미지로 복구
            setProfileImage(user?.memberProfileImage || 'static/img/profile/default_profile_images.svg');
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="page-container">
            <h1>마이페이지</h1>

            <div className="mypage-container">
                <div className="mypage-section">
                    <h2>회원 정보</h2>
                    {/*   <div className="profile-image-section">*/}
                    {/*       <label>프로필 이미지</label>*/}
                    {/*       <div className="profile-image-container">*/}
                    {/*           <img src={profileImage}*/}
                    {/*                className="profile-image"*/}
                    {/*           />*/}
                    {/*           <div className="profile-image-overlay">*/}
                    {/*               {isUploading ? "업로드 중..." : "이미지 변경"}*/}
                    {/*           </div>*/}
                    {/*       </div>*/}
                    {/*</div>*/}
                    <div className="info-group">

                        {/*<div className="info-item">*/}
                        {/*    <span className="info-label">프로필 이미지</span>*/}
                        {/*    <div className="profile-image-section">*/}
                        {/*        <div className="profile-image-container" onClick={handleProfileClick}>*/}
                        {/*            <img*/}
                        {/*                src={profileImage}*/}
                        {/*                className="profile-image"*/}
                        {/*            />*/}
                        {/*            <div className="profile-image-overlay">*/}
                        {/*                {isUploading ? "업로드 중..." : "이미지 변경"}*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*        <input type="file"*/}
                        {/*               ref={fileInputRef}*/}
                        {/*               onChange={handleProfileChange}*/}
                        {/*               accept="image/*"*/}
                        {/*               style={{display: 'none'}}*/}
                        {/*               multiple*/}
                        {/*        />*/}
                        {/*        <span className="form-hint">이미지를 클릭하여 변경할 수 있습니다.(최대 5MB)</span>*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                        <div className="info-item">
                            <span className="info-label">프로필 이미지</span>
                            {/* 이미지 경로는 존재하지만 이미지 경로에 이미지가 존재하지 않을 경우 */}
                            <img src={user?.memberProfileImage || '/static/img/profile/default_profile_image.svg'} />
                        </div>

                        <div className="info-item">
                            <span className="info-label">이메일</span>
                            <span className="info-value">{user.memberEmail || '-'}</span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">이름</span>
                            <span className="info-value">{user.memberName || '-'}</span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">전화번호</span>
                            <span className="info-value">{user.memberTel || '-'}</span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">주소</span>
                            <span className="info-value">
                                {user.memberAddress ? (
                                    <>
                                        ({user.memberPostcode || '-'}) {user.memberAddress}
                                        {user.memberDetailAddress && ` ${user.memberDetailAddress}`}
                                    </>
                                ) : '-'}
                            </span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">가입일</span>
                            <span className="info-value">
                                {user.memberCreatedAt ?
                                    new Date(user.memberCreatedAt).toLocaleDateString('ko-KR')
                                    :
                                    '-'}
                            </span>
                        </div>
                    </div>

                    <div className="mypage-actions">
                        <button
                            className="button btn-edit"
                            onClick={handleClick}
                        >
                            회원정보 수정
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

};

export default MyPage;