import React, { useState } from 'react';

const LikeButton = () => {
    // 여기에 코드 작성
    // 1. useState로 좋아요 수 상태 만들기 (초기값: 0)
    // 2. 증가 함수 만들기
    // 3. 초기화 함수 만들기

    const [count, setCount] = useState(0);

    // 버튼 기능 만들기
    const handleLikeCount = () => {
        setCount(count + 1);
    };
    // 초기화 버튼 만들기
    const handleReset = () => {
        setCount(0);
    };

    return (
        <>
            {/* 좋아요 수 표시 */}
            <h3>좋아요 : {count}</h3>

            {/* 하트 버튼 */}
            <button onClick={handleLikeCount}>
                ❤️
            </button>

            {/* 10 이상이면 메시지 표시 */}
            {count >= 10 && (
                <div>
                    인기 게시물 입니다.
                </div>
            )}

            {/* 초기화 버튼 */}
            <button type="reset" onClick={handleReset}>[초기화]</button>

        </>
    );
}

export default LikeButton;