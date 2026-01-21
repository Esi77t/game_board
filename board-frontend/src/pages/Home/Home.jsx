import { useNavigate, useSearchParams } from "react-router-dom";
import "./Home.css";
import { useEffect, useState } from "react";
import { getCategories } from "../../api/category";
import { getBoardList, getBoardsByCategory, searchBoards } from "../../api/board";
import Search_Outline from "../../assets/icons/Search_Outline.svg";
import BoardCard from "../../components/BoardCard/BoardCard";
import Pagination from "../../components/Pagination/Pagination";

const Home = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParmas] = useSearchParams();

    const [boards, setBoards] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const page = parseInt(searchParams.get('page') || '0');
        const keyword = searchParams.get('keyword') || '';
        const categoryId = searchParams.get('category') || null;

        setCurrentPage(page);
        setSearchKeyword(keyword);
        setSelectedCategory(categoryId);

        fetchBoard(page, keyword, categoryId);
    }, [searchParams])

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories();
        } catch (error) {
            console.error("카테고리를 불러오는 데 실패했습니다: ", error);
        }
    }

    const fetchBoard = async (page, keyword, categoryId) => {
        setLoading(true);
        try {
            let data;

            if (keyword) {
                // 검색
                data = await searchBoards(keyword, page, 10);
            } else if (categoryId) {
                // 카테고리별 조회
                data = await getBoardsByCategory(categoryId, page, 10);
            } else {
                // 전체 조회
                data = await getBoardList(page, 10);
            }

            setBoards(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('게시글을 불러오는 데 실패했습니다: ', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchKeyword.trim()) {
            setSearchParmas({ keyword: searchKeyword, page: 0 });
        }
    };

    const handleCategoryClick = (categoryId) => {
        if (categoryId) {
            setSearchParmas({ category: categoryId, page: '0' });
        } else {
            setSearchParmas({ page: '0' });
        }
    };

    const handlePageChange = (page) => {
        const params = {};
        if (searchKeyword) params.keyword = searchKeyword;
        if (selectedCategory) params.category = selectedCategory;
        params.page = page.toString();
        setSearchKeyword(params);
    }

    return (
        <div className="home-container">
            <div className="home-header">
                <h2>게시판</h2>
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="게시글 검색"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-button">
                        <img src={Search_Outline} alt="검색" className="icons" />
                    </button>
                </form>
                {/* 카테고리 필터 */}
                {categories && categories.length > 0 && (
                    <div className="category-filter">
                        <button
                            className={`category-button ${!selectedCategory ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(null)}
                        >
                            전체
                        </button>
                        {categories.map(category => (
                            <button
                                key={category.id}
                                className={`category-button ${selectedCategory === category.id.toString() ? 'active' : ''}`}
                                onClick={() => handleCategoryClick(category.id)}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                )}
                {/* 게시글 목록 */}
                {loading ? (
                    <div className="loading">불러오는 중</div>
                ) : Array.isArray(boards) && boards.length > 0 ? (
                    <>
                        <div className="board-list">
                            {boards.map(board => (
                                <BoardCard key={board.id} board={board} />
                            ))}
                        </div>
                        {/* 페이지 네이션 */}
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                ) : (
                    <div className="empty-message">게시글이 없습니다.</div>
                )}
            </div>
        </div>
    );
}

export default Home;