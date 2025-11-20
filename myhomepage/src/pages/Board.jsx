import {useEffect, useState} from "react";
import axios from "axios";
import "./boards.css";
import {useNavigate} from "react-router-dom";

// 전체 게시판
// 1. const Board = () => () -> {} 변경
// 2. useEffect 이용해서 8085/api/board/all 데이터 가져오기
//    axios.get 이용
// const [boards, setBoards] = useState([]);
// boards 에 백엔드에서 가져온 데이터 추가
// 캐시 무효화 진행 후 시작!


const Board = () => {

    const [boards, setBoards] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8085/api/board/all")
            .then(res => {
                console.log("1. boards : ", boards); // res.data 백엔드에서 가져온 데이터를
                // boards 에 넣어주기 전 이므로, 데이터가 0 인 상태가 맞음
                console.log("백엔드에서 가져온 데이터 : ", res.data);
                console.log("백엔드에서 가져온 데이터를 boards 에 저장 : ", setBoards(res.data));
                setBoards(res.data); // boards 변수이름에 데이터 저장 기능 실행
                console.log("2. boards : ", boards);
                console.log("3. setBoards: ", setBoards(res.data));
            })
            .catch(e => alert("데이터를 가져올 수 없습니다."))
    }, []);

    // ㅇ

    const handleIDClick = (id) => {
        navigate(`/board/${id}`)
    }

    return (
        <div className="page-container">
            <div className="board-header">
                <h1>게시판</h1>
                <button className="button">
                    글쓰기
                </button>
            </div>

            <div className="board-info">
                <p>전체 게시물: {boards.length}개</p>
            </div>

            <table className="board-table">
                <thead>
                <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>조회수</th>
                    <th>작성일</th>
                </tr>
                </thead>

                {/*
                content: "글쓰기 데이터 입력 됐나요?"
                createdAt: "2025-11-07 11:56:00"
                id: 12
                popularUpdateAt: null
                ranking: null
                title: "확인용입니다"
                updatedAt: "2025-11-07 11:56:00"
                viewCount: 0
                writer: "개발자"
                */}
                {/*
                1. 제목 클릭해도 게시물에 들어가도록 설정
                2. 에러 해결
                */}
                <tbody>
                {boards.map((b) => (
                        <tr onClick={() => handleIDClick(b.id)} key={b.id}>
                            <td>{b.id}</td>
                            <td>{b.title}</td>
                            <td>{b.writer}</td>
                            <td>{b.viewCount}</td>
                            <td>{b.createdAt}</td> {/* 2025-11-07 11:56:00 -> 2025-11-07 */}
                        </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Board;