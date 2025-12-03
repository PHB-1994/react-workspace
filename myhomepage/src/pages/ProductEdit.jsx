import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {fetchProductDetail, getProductImageUrl, getProfileImageUrl} from "../service/ApiService";
import axios from "axios";
import {handleChangeImage, handleInputChange} from "../service/commonService";
import {useAuth} from "../context/AuthContext";

/**
 * 과제 3 : 수정하기 수정된 결과 반영
 *      check 사항 : 1. 상품 수정 시 현재 등록된 메인 이미지 가져오기
 *      check 사항 : 2. 메인 이미지 수정하고, 수정된 결과 미리보기
 *      check 사항 : 3. 수정된 내용이 제대로 반영 되는가
 *          * 참고 : 미리보기만 하고, 수정하기 버튼을 눌러야 메인이미지 수정되게 하기
 *
 * handleChangeImage 함수 재사용하여 변경
 * product 관련페이지들 로그인 안되어 있으면 바로 로그인페이지로 이동
 */
const ProductEdit = () => {
    // 윈도우는 기본적으로 원화모양으로 펄더 나 위치 구분 코드상에서는 \ 모형으로 표기
    // \ 주석에도 쓰면 안됨 !!!!!! \ 특수기호를 추가로 작성하는 것은 기본으로 내장되어 있는 특수기호들에 대한 효과가 발동되므로 사용
    const defaultImage = '/static/img/default.png';
    const {id} = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    // 초기값을 로딩은 true -> false
    const [loading, setLoading] = useState(false);
    const {user, isAuthenticated} = useAuth();
    const [product, setProduct] = useState({
        productName: '',
        productCode: '',
        category: '',
        price: '',
        stockQuantity: '',
        description: '',
        manufacturer: '',
        imageUrl: '',
        isActive: 'Y'
    });

    const [formData, setFormData] = useState({
        productName: '',
        productCode: '',
        category: '',
        price: '',
        stockQuantity: '',
        description: '',
        manufacturer: '',
        imageUrl: '',
        isActive: 'Y'
    });


    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [errors, setErrors] = useState({});

    const categories = [
        '전자제품', '가전제품', '의류', '식품', '도서', '악세사리', '스포츠', '완구', '가구', '기타'
    ]

    useEffect(() => {
        if (!loading && !isAuthenticated) navigate("/login");
    }, [loading, isAuthenticated, navigate]);

    useEffect(() => {
        fetchProductDetail(axios, id, setProduct, navigate, setLoading);
    }, [id]); // id 값이 조회될 때마다 상품 상세보기 데이터 조회

    // useEffect(() =>{
    //     if(user) {
    //         setProduct(prev => ({
    //             ...prev,
    //             productName: product.productName || '',
    //             productCode: product.productCode || '',
    //             category: product.category || '',
    //             price: product.price || '',
    //             stockQuantity: product.stockQuantity || '',
    //             description: product.description || '',
    //             manufacturer: product.manufacturer || '',
    //         }));
    //         // 프로필 이미지 설정
    //         // setPreviewImage(getProductImageUrl(product));
    //     }
    // },[user?.memberEmail]); // user.memberemail 이 변경될 때만 실행

    const handleChange = (e) => {
        handleInputChange(e, setProduct);
        // 개발자가 원하는 정규식이나, 입력 형식에 일치하게 작성했는지 체크
    }

    const handleCancel = () => {
        if (window.confirm("수정을 취소하시겠습니까? 변경사항이 저장되지 않습니다.")) {
            navigate(`/product/${id}`);
        }
    }

    const handleImageClick = () => {
        fileInputRef.current?.click();
    }

    /* TODO : 해야할 기능
        0. 제출 일시 정지 / 유효성 검사
        1. 변경된 데이터를 가져온다.
        2. 백엔드에 데이터를 어떻게 전달할지 결정한다.
        3. 백엔드에서 @RequestPart 라면 Product 객체와 이미지 파일을 분리한 후, product 객체는 JSON -> 문자열 형태로
        4. 이미지는 Multipart 로 전달한다.
        5. axios put / patch 를 이용해서 백엔드 매핑이랑 연동한다.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const uploadFormData = new FormData();
            // 따로 제외하고 싶은 데이터의 변수 명칭을 ... 형태가 나오기 전에 작성하여 제거한 후, 나머지 데이터를 전달할 때 사용하는 방법
            const {imageUrl, ...updateProductData} = product;
            const updateBlob = new Blob(
                [JSON.stringify(updateProductData)],
                {type: "application/json"})

            uploadFormData.append("product", updateBlob);

            if (imageUrl) {
                uploadFormData.append("imageFile", imageUrl);
            }

            const r = await axios.put(`http://localhost:8085/api/product/${id}`, uploadFormData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

            if (r.data.success) {
                alert(r.data.message);
                navigate("/");
            } else {
                alert(r.data.message);
            }

        } catch(error) {
            alert("서버에 문제가 발생했습니다.");
        }
    }

    // isActive data 가 null 일 경우 N 으로 체크 표기
    return (
        <div className="page-container">
            <div className="product-upload-container">
                <h2>상품 수정</h2>
                <form className="product-form">

                    {/* 상품 이미지 */}
                    <div className="form-group">
                        <label>상품 이미지</label>
                        <div className="profile-image-container" onClick={handleImageClick}>
                            <img
                                src={previewImage || product.imageUrl || defaultImage}
                                alt="상품 이미지"
                                className="profile-image"
                            />
                            <div className="profile-image-overlay">
                                이미지 변경
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleChangeImage(setPreviewImage, setImageFile, setProduct)}
                            accept="image/*"
                            style={{display: 'none'}}
                        />
                        <small className="form-hint">
                            이미지를 클릭하여 변경할 수 있습니다.(최대 5MB)
                        </small>
                    </div>

                    {/* 상품명 */}
                    <div className="form-group">
                        <label htmlFor="productName">
                            상품명<span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="productName"
                            name="productName"
                            value={product.productName}
                            onChange={handleChange}
                            placeholder="상품명을 입력하세요."
                            maxLength="200"
                        />
                        {errors.productName && (
                            <span className="error">{errors.productName}</span>
                        )}
                    </div>

                    {/* 상품코드 - 읽기전용 */}
                    <div className="form-group">
                        <label htmlFor="productCode">
                            상품코드<span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="productCode"
                            name="productCode"
                            value={product.productCode}
                            readOnly
                        />
                        <small className="form-hint">
                            상품코드는 변경할 수 없습니다.
                        </small>
                    </div>

                    {/* 카테고리 */}
                    <div className="form-group">
                        <label htmlFor="category">
                            카테고리<span className="required">*</span>
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={product.category}
                            onChange={handleChange}>
                            <option value="">카테고리를 선택하세요.</option>
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        {errors.category && (
                            <span className="error">{errors.category}</span>
                        )}
                    </div>

                    {/* 가격 */}
                    <div className="form-group">
                        <label htmlFor="price">
                            가격<span className="required">*</span>
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            placeholder="가격 (원)"
                            min="0"
                        />
                        {errors.price && (
                            <span className="error">{errors.price}</span>
                        )}
                    </div>

                    {/* 재고수량 */}
                    <div className="form-group">
                        <label htmlFor="stockQuantity">
                            재고수량<span className="required">*</span>
                        </label>
                        <input
                            type="number"
                            id="stockQuantity"
                            name="stockQuantity"
                            value={product.stockQuantity}
                            onChange={handleChange}
                            placeholder="재고 수량"
                            min="0"
                        />
                        {errors.stockQuantity && (
                            <span className="error">{errors.stockQuantity}</span>
                        )}
                    </div>

                    {/* 제조사 */}
                    <div className="form-group">
                        <label htmlFor="manufacturer">
                            제조사
                        </label>
                        <input
                            type="text"
                            id="manufacturer"
                            name="manufacturer"
                            value={product.manufacturer}
                            onChange={handleChange}
                            placeholder="제조사 명을 입력하세요."
                            maxLength="100"
                        />
                    </div>

                    {/* 판매 상태 */}
                    <div className="form-group">
                        <label>
                            판매 상태<span className="required">*</span>
                        </label>
                        <div className="radio-group">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="isActive"
                                    value="Y"
                                    checked={product.isActive === 'Y'}
                                />
                                <span>판매중</span>
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="isActive"
                                    value="N"
                                    checked={product.isActive === 'N'}
                                />
                                <span>판매중지</span>
                            </label>
                        </div>
                        <small className="form-hint">
                            판매중으로 설정하면 고객에게 노출됩니다.
                        </small>
                    </div>

                    {/* 상품설명 */}
                    <div className="form-group">
                        <label htmlFor="description">
                            상품설명
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={product.description}
                            onChange={handleChange}
                            placeholder="상품에 대한 설명을 입력하세요"
                            rows="5"
                        />
                    </div>

                    {/* 버튼 */}
                    <div className="form-buttons">
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading}
                            onClick={handleSubmit}>
                            {loading ? '수정 중...' : '수정 완료'}
                        </button>
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={handleCancel}
                            disabled={loading}>
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProductEdit;