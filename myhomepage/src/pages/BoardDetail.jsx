import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {fetchBoardDetail, getProfileImageUrl} from "../service/ApiService";
import {goToPage, renderLoading} from "../service/commonService";

const BoardDetail = () => {
    const {id} = useParams(); //URL 에서 id 가져오기
    const navigate = useNavigate();
    const [board, setBoard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBoardDetail(axios, id, setBoard, navigate, setLoading);
    }, [id]);

    // 로딩중 일 때
    if (loading) return renderLoading('게시물을 불러오는 중');

    if (!board) {
        renderLoading('게시물을 찾을 수 없습니다.');
        goToPage(navigate, "/board");
    }

    let 상세이미지들 = [];

    if (board.boardDetailImage) {
        상세이미지들 = board.boardDetailImage.split(',');
    }

    return (
        <div className="page-container">
            <h1 className="board-detail-title">{board.title}</h1>
            <div className="product-detail-image">
                {board.boardMainImage ?
                    <img src={board.boardMainImage}
                         alt={board.title}/>
                    :
                    <img src="/static/img/default.png"
                         alt="default"
                    />}
            </div>
            <div className="board-detail-info">
                <span>작성자 : {board.writer}</span>
                <span>조회수 : {board.viewCount}</span>
                <span>작성일 : {board.createdAt}</span>
            </div>
            {상세이미지들.map((이미지경로, 순번) => (
                <div key={순번}>
                    <img src={이미지경로}/>
                </div>
            ))}
            <div className="board-detail-content">
                {board.content}
            </div>
            <button className="button" onClick={() => goToPage(navigate, '/board')}>
                목록으로
            </button>

        </div>
    );
};

export default BoardDetail;