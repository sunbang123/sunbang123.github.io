document.addEventListener('DOMContentLoaded', function() {
    // 전역 변수
    let currentPage = 1;
    let postsPerPage = 10;
    let isSimpleView = false;
    let filteredPosts = [];
    let allPosts = [];
    
    // 요소 참조
    const postItems = document.querySelectorAll('.post-item');
    const postList = document.getElementById('postList');
    const paginationContainer = document.getElementById('paginationContainer');
    const pagination = document.getElementById('pagination');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const toggleViewBtn = document.getElementById('toggleView');
    const postsPerPageSelect = document.getElementById('postsPerPage');
    const searchInput = document.getElementById('searchInput');
    
    // 초기화
    init();
    
    function init() {
        allPosts = Array.from(postItems);
        filteredPosts = [...allPosts];
        
        // 이벤트 리스너
        toggleViewBtn.addEventListener('click', toggleView);
        postsPerPageSelect.addEventListener('change', changePostsPerPage);
        loadMoreBtn.addEventListener('click', loadMore);
        
        // 초기 페이징 설정
        updateDisplay();
        initSearch();
        
        // 애니메이션 초기화
        if (typeof gsap !== 'undefined') {
            initAnimations();
        }
    }
    
    function toggleView() {
        isSimpleView = !isSimpleView;
        const toggleText = document.getElementById('toggleText');
        
        if (isSimpleView) {
            postList.classList.add('simple-view');
            toggleText.innerHTML = '📄 상세히 보기';
        } else {
            postList.classList.remove('simple-view');
            toggleText.innerHTML = '📋 간단히 보기';
        }
    }
    
    function changePostsPerPage() {
        const value = postsPerPageSelect.value;
        const newPostsPerPage = value === 'all' ? filteredPosts.length : parseInt(value);
        
        // 현재 보고 있던 첫 번째 포스트의 인덱스 계산
        const currentFirstPostIndex = (currentPage - 1) * postsPerPage;
        
        // 새로운 페이지 크기로 해당 포스트가 어느 페이지에 있는지 계산
        const newPage = Math.floor(currentFirstPostIndex / newPostsPerPage) + 1;
        
        postsPerPage = newPostsPerPage;
        currentPage = Math.max(1, Math.min(newPage, Math.ceil(filteredPosts.length / postsPerPage)));
        
        updateDisplay();
    }
    
    function updateDisplay() {
        const totalPosts = filteredPosts.length;
        
        if (totalPosts === 0) {
            // 포스트가 없는 경우
            allPosts.forEach(post => post.style.display = 'none');
            updateStats(0, 0, 0);
            updatePagination(0);
            return;
        }
        
        const totalPages = Math.ceil(totalPosts / postsPerPage);
        
        // 현재 페이지가 유효한 범위에 있는지 확인
        if (currentPage > totalPages) {
            currentPage = totalPages;
        }
        if (currentPage < 1) {
            currentPage = 1;
        }
        
        // 모든 포스트 숨기기
        allPosts.forEach(post => post.style.display = 'none');
        
        // 현재 페이지 포스트만 표시
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = Math.min(startIndex + postsPerPage, totalPosts);
        
        for (let i = startIndex; i < endIndex; i++) {
            if (filteredPosts[i]) {
                filteredPosts[i].style.display = '';
            }
        }
        
        // UI 업데이트
        updatePagination(totalPages);
        updateLoadMoreButton(totalPosts, endIndex);
        updateStats(totalPosts, startIndex + 1, endIndex);
    }
    
    function updatePagination(totalPages) {
        const paginationContainer = document.getElementById('paginationContainer');
        const pagination = document.getElementById('pagination');
        
        if (postsPerPage >= filteredPosts.length || totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }
        
        paginationContainer.style.display = 'block';
        loadMoreBtn.style.display = 'none';
        
        // 현재 페이지가 총 페이지 수를 초과하는 경우 조정
        if (currentPage > totalPages) {
            currentPage = totalPages;
        }
        
        let paginationHTML = '';
        
        // 이전 버튼
        paginationHTML += `
          <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${Math.max(1, currentPage - 1)}" aria-label="이전">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
        `;
        
        // 페이지 번호들
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // 첫 페이지 표시 (startPage가 1이 아닐 때)
        if (startPage > 1) {
            paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="1">1</a></li>`;
            if (startPage > 2) {
                paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
              <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
              </li>
            `;
        }
        
        // 마지막 페이지 표시 (endPage가 totalPages가 아닐 때)
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
            paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a></li>`;
        }
        
        // 다음 버튼
        paginationHTML += `
          <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${Math.min(totalPages, currentPage + 1)}" aria-label="다음">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        `;
        
        pagination.innerHTML = paginationHTML;
        
        // 기존 이벤트 리스너 제거 후 새로 추가
        const newPagination = pagination.cloneNode(true);
        pagination.parentNode.replaceChild(newPagination, pagination);
        
        // 페이지 클릭 이벤트 재등록
        newPagination.addEventListener('click', function(e) {
            e.preventDefault();
            const link = e.target.closest('.page-link');
            if (link && !link.closest('.disabled') && !link.closest('.active')) {
                const page = parseInt(link.dataset.page);
                if (page && page !== currentPage && page >= 1 && page <= totalPages) {
                    goToPage(page);
                }
            }
        });
    }
    
    function updateLoadMoreButton(totalPosts, currentEndIndex) {
        const remaining = totalPosts - currentEndIndex;
        
        if (remaining > 0 && postsPerPage < filteredPosts.length) {
            loadMoreBtn.style.display = 'block';
            const loadMoreCount = document.querySelector('.load-more-count');
            loadMoreCount.textContent = `(${remaining}개 더)`;
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }
    
    function loadMore() {
        const button = loadMoreBtn;
        button.disabled = true;
        button.classList.add('loading');
        
        setTimeout(() => {
            postsPerPage += 10;
            updateDisplay();
            button.disabled = false;
            button.classList.remove('loading');
        }, 500);
    }
    
    function goToPage(page) {
        // 페이드 아웃 효과
        const visiblePosts = allPosts.filter(post => post.style.display !== 'none');
        visiblePosts.forEach(post => post.classList.add('fade-out'));
        
        setTimeout(() => {
            currentPage = page;
            updateDisplay();
            
            // 페이드 인 효과
            const newVisiblePosts = allPosts.filter(post => post.style.display !== 'none');
            newVisiblePosts.forEach(post => {
                post.classList.remove('fade-out');
                post.classList.add('fade-in');
            });
            
            // 페이지 상단으로 스크롤
            document.querySelector('.post-list').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 300);
    }
    
    function updateStats(total, start, end) {
        const searchStats = document.getElementById('searchStats');
        if (searchInput.value.trim()) {
            searchStats.textContent = `${total}개의 검색 결과 중 ${start}-${end}번째`;
        } else {
            if (total === allPosts.length) {
                searchStats.textContent = `총 ${total}개의 포스트 중 ${start}-${end}번째`;
            } else {
                searchStats.textContent = `${total}개의 검색 결과 중 ${start}-${end}번째`;
            }
        }
    }
    
    function initSearch() {
        let searchTimeout;
        
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(e.target.value);
            }, 300);
        });
        
        // 검색어 지우기 버튼
        const clearButton = document.getElementById('clearSearch');
        clearButton.addEventListener('click', function() {
            searchInput.value = '';
            searchInput.focus();
            performSearch('');
        });
    }
    
    function performSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (!searchTerm) {
            filteredPosts = [...allPosts];
        } else {
            filteredPosts = allPosts.filter(item => {
                const title = item.dataset.title || '';
                const content = item.dataset.content || '';
                const tags = item.dataset.tags || '';
                
                return title.includes(searchTerm) || 
                       content.includes(searchTerm) || 
                       tags.includes(searchTerm);
            });
        }
        
        currentPage = 1;
        updateDisplay();
        
        // 검색 결과 없음 처리
        const noResults = document.getElementById('noResults');
        noResults.style.display = searchTerm && filteredPosts.length === 0 ? 'block' : 'none';
        
        // 검색어 지우기 버튼
        const clearButton = document.getElementById('clearSearch');
        clearButton.style.display = searchTerm ? 'block' : 'none';
    }
    
    function initAnimations() {
        gsap.registerPlugin(ScrollTrigger);
        
        const title = document.querySelector('.animated-title');
        if (title) {
            gsap.from(title, {
                duration: 1,
                y: -50,
                opacity: 0,
                ease: 'power3.out'
            });
        }
    }
});