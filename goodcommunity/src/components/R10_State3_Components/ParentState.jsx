import {useState} from "react";
import ChildIdState from "./ChildIdState";
import ChildPwState from "./ChildPwState";

/*
React 에서 매주 중요한 상태 끌어올리기(Lifting State Up) Pattern

부모 컴포넌트가 모든 데이터(상태)와 그 데이터를 변경하는 함수를 가지고 있고,
그 자식 컴포넌트(ChildIdState, ChildPwState) 는 부모로부터 그 함수를 전달 받아
실행만 하는 구조이며,
그 자식 컴포넌트는 UI 를 중점으로 코딩 기술

부모 컴포넌트 = 기능, 데이터 중점으로 코드 작성
자식 컴포넌트 = 기능과 데이터는 부모에게 전달받고, UI 를 중점으로 코드 작성
 */
const ParentComponent = () => {

    const [id, setId] = useState('');
    const [pw, setPw] = useState('');


    const idHandler = (e) => {
        setId(e.target.value);
    };

    const pwHandler = (e) => {
        setPw(e.target.value);
    };

    return (
        <>
            <ChildIdState handler={idHandler} />
            <ChildPwState handler={pwHandler} />
            <div className="wrapper">
                <button disabled={id.length === 0 || pw.length === 0} >
                    Login
                </button>
            </div>
        </>
    );
};

export default ParentComponent;