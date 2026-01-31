import { useNavigate } from "react-router-dom";
import "./MyPage.css";
import { ChangeEvent, useEffect, useState } from "react";
import { User } from "../../types";
import { changePassword, deleteAccount, getMyProfile, updateProfile, uploadProfileImage } from "../../api/auth";
import { getImageUrl } from "../../config/imageUrl";

const MyPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isPasswordMode, setIsPasswordMode] = useState(false);

    // 프로필 수정
    const [editData, setEditData] = useState({
        nickname: '',
        email: ''
    });

    // 비밀번호 변경
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // 회원탈퇴
    const [deletePassword, setDeletePassword] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const userData = await getMyProfile();
            setUser(userData);
            setEditData({
                nickname: userData.nickname,
                email: userData.email
            });
        } catch (error) {
            console.error('프로필 조회 실패: ', error);
            alert('프로필을 불러오는데 실패했습니다.');
        }
    }

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 파일 크기 체크
        if (file.size > 5 * 1024 * 1024) {
            alert('파일 크기는 5MB 이하여야 합니다.');
            return;
        }

        try {
            const result = await uploadProfileImage(file);

            if (user) {
                const updatedUser = { ...user, profileImageUrl: result.imageUrl };
                setUser(updatedUser);

                // localstorage 업데이트
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            alert('프로필 이미지가 변경되었습니다.');
        } catch (error) {
            console.error('이미지 업로드 실패: ', error);
            alert('이미지 업로드에 실패했습니다.')
        }
    };

    const handleEditToggle = () => {
        if (isEditMode) {
            // 취소하면 원래 데이터로 복원용으로
            if (user) {
                setEditData({
                    nickname: user.nickname,
                    email: user.email
                })
            }
        }

        setIsEditMode(!isEditMode);
    }

    const handleProfileSave = async () => {
        if (!editData.nickname.trim()) {
            alert('닉네임을 입력해주세요');
            return;
        }

        if (!editData.email.trim()) {
            alert('이메일을 입력해주세요');
            return;
        }

        try {
            const updatedUser = await updateProfile(editData);
            setUser(updatedUser);

            // localstorage에 업데이트
            localStorage.setItem('user', JSON.stringify(updatedUser));

            alert('프로필이 수정되었습니다.');
        } catch (error: any) {
            console.error('프로필 수정 실패: ', error);
            alert(error.response?.data?.message || '프로필 수정에 실패했습니다.')
        }
    }

    // 비밀번호 변경
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            alert('비밀번호는 6자 이상이어야 합니다.');
            return;
        }

        try {
            await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            alert('비밀번호가 변경되었습니다.');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setIsPasswordMode(false);
        } catch (error: any) {
            console.error('비밀번호 변경 실패:', error);
            alert(error.response?.data?.message || '비밀번호 변경에 실패했습니다.');
        }
    };

    // 회원탈퇴
    const handleDeleteAccount = async () => {
        if (!deletePassword.trim()) {
            alert('비밀번호를 입력해주세요.');
            return;
        }

        try {
            await deleteAccount(deletePassword);
            
            // 로컬 데이터 삭제
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            alert('회원탈퇴가 완료되었습니다.');
            navigate('/');
        } catch (error: any) {
            console.error('회원탈퇴 실패:', error);
            alert(error.response?.data?.message || '회원탈퇴에 실패했습니다.');
        }
    };

    if (!user) {
        return <div className="mypage-container">불러오는 중</div>;
    }

    return (
        <div className="mypage-container">
            <div className="mypage-wrapper">
                <h1>마이페이지</h1>
                {/* 프로필 섹션 */}
                <div className="profile-section">
                    <div className="profile-image-wrapper">
                        <div className="profile-image">
                            {user.profileImageUrl ? (
                                <img
                                    src={getImageUrl(user.profileImageUrl) || ''}
                                    alt="프로필"
                                />
                            ) : (
                                <div className="profile-image-default">
                                    {user.nickname.charAt(0)}
                                </div>
                            )}
                        </div>
                        <label htmlFor="profile-image-input">
                            이미지 변경
                        </label>
                        <input
                            type="file"
                            id="profile-image-input"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                    <div className="profile-info">
                        <div className="info-group">
                            <label>아이디</label>
                            <input type="text" value={user.userId} disabled />
                        </div>
                    </div>
                    <div className="profile-info">
                        <div className="info-group">
                            <label>아이디</label>
                            <input type="text" value={user.userId} disabled />
                        </div>
                        <div className="info-group">
                            <label>닉네임</label>
                            <input
                                type="text"
                                value={editData.nickname}
                                onChange={(e) => setEditData({ ...editData, nickname: e.target.value })}
                                disabled={!isEditMode}
                            />
                        </div>
                        <div className="info-group">
                            <label>이메일</label>
                            <input
                                type="email"
                                value={editData.email}
                                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                disabled={!isEditMode}
                            />
                        </div>
                        <div className="info-group">
                            <label>가입일</label>
                            <input
                                type="text"
                                value={new Date(user.createdAt).toLocaleDateString()}
                                disabled
                            />
                        </div>
                        <div className="button-group">
                            {!isEditMode ? (
                                <button className="btn-primary" onClick={handleEditToggle}>
                                    프로필 수정
                                </button>
                            ) : (
                                <>
                                    <button className="btn-cancel" onClick={handleEditToggle}>
                                        취소
                                    </button>
                                    <button className="btn-primary" onClick={handleProfileSave}>
                                        저장
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {/* 비밀번호 변경 섹션 */}
                <div className="password-section">
                    <button
                        className="section-toggle"
                        onClick={() => setIsPasswordMode(!isPasswordMode)}
                    >
                        비밀번호 변경 {isPasswordMode ? '▲' : '▼'}
                    </button>
                    {isPasswordMode && (
                        <form onSubmit={handlePasswordChange} className="password-form">
                            <div className="info-group">
                                <label>현재 비밀번호</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="info-group">
                                <label>새 비밀번호</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="info-group">
                                <label>새 비밀번호 확인</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn-primary">
                                비밀번호 변경
                            </button>
                        </form>
                    )}
                </div>
                {/* 회원탈퇴 섹션 */}
                <div className="delete-section">
                    {!showDeleteConfirm ? (
                        <button
                            className="btn-danger"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            회원탈퇴
                        </button>
                    ) : (
                        <div className="delete-confirm">
                            <p className="warning-text">
                                ⚠️ 회원탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
                            </p>
                            <div className="info-group">
                                <label>비밀번호 확인</label>
                                <input
                                    type="password"
                                    value={deletePassword}
                                    onChange={(e) => setDeletePassword(e.target.value)}
                                    placeholder="비밀번호를 입력하세요"
                                />
                            </div>
                            <div className="button-group">
                                <button
                                    className="btn-cancel"
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setDeletePassword('');
                                    }}
                                >
                                    취소
                                </button>
                                <button
                                    className="btn-danger"
                                    onClick={handleDeleteAccount}
                                >
                                    탈퇴하기
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MyPage;