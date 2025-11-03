import {useState} from "react";

// className 에도 styles 를 작성해도 된다. 하지만
// style 내부에 styles 작성하고, 해당하는 styles 을 넣는 기법 좀 더 많이 사용
const styles = {
    wrapper : {
        padding : '1rem',
        backgroundColor : '#f0fdf4',
        borderRadius : '8px',
        marginBottom : '1rem'
    },
    label : {
        display : 'flex',
        flexDirection : 'column',
        gap : '0.5rem',
        color : '#15803d',
        fontWeight : '600',
        fontSize : '0.9rem'
    },
    input : {
        padding : '0.6rem 0.8rem',
        border : '2px solid #86efac',
        borderRadius: '6px',
        outline : 'none',
        fontSize: '1rem'
    }
}

// 자식 내부에서 input 값에 변경이 일어나면
// 부모에게 handler 라는 명칭으로 변경된 내용을 전달하며
// handle 는 부모와 자식을 상호작용 할 수 있도록 해주는 중간다리 역할의 변수 이름
const ChildPwState = ({handler}) => {
    return(
        <div style={styles.wrapper}>
            <label style={styles.label}>
                PW
            <input style={styles.input}
                   type="password"
                   id="inputPw"
                   onChange={handler} />
            </label>
        </div>
    )
}

export default ChildPwState;