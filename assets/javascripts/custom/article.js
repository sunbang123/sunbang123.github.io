document.addEventListener('DOMContentLoaded', function() {
    // =========================================
    // 1. 전역 변수 설정
    // =========================================
    let currentPage = 1;
    let postsPerPage = 10;
    let filteredPosts = [];
    let allPosts = [];
    
    // =========================================
    // 2. DOM 요소 참조
    // =========================================
    const postItems = document.querySelectorAll('.post-item');
    const postList = document.getElementById('postList');
    const paginationContainer = document.getElementById('paginationContainer');
    const pagination = document.getElementById('pagination');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const toggleViewBtn = document.getElementById('toggleView');
    const postsPerPageSelect = document.getElementById('postsPerPage');
    const searchInput = document.getElementById('searchInput');
    
    // 필수 요소 체크
    if (!postList) {
        console.log('Post list element not found.');
        return;
    }
    
    // =========================================
    // 3. 초기화 (Init)
    // =========================================
    init();
    
    function init() {
        // NodeList를 Array로 변환하여 관리
        allPosts = Array.from(postItems);
        filteredPosts = [...allPosts];
        
        // --- 이벤트 리스너 등록 ---

        // 1. 뷰 토글 (목록형/간단형)
        if (toggleViewBtn) {
            toggleViewBtn.addEventListener('click', toggleView);
        }
        
        // 2. 페이지당 게시물 수 변경
        if (postsPerPageSelect) {
            postsPerPageSelect.addEventListener('change', changePostsPerPage);
        }
        
        // 3. 더보기 버튼
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', loadMore);
        }
        
        // 4. 검색 기능 초기화
        initSearch();

        // 5. ✅ [핵심 수정] 페이지네이션 클릭 이벤트 (init에서 한 번만 등록)
        if (pagination) {
            pagination.addEventListener('click', function(e) {
                e.preventDefault(); // 링크 이동 방지
                
                // 클릭된 요소가 .page-link 내부인지 확인
                const link = e.target.closest('.page-link');
                
                // 유효한 링크이고, disabled나 active 상태가 아닐 때만 실행
                if (link && !link.parentElement.classList.contains('disabled') && !link.parentElement.classList.contains('active')) {
                    const page = parseInt(link.dataset.page);
                    
                    // 유효한 페이지 번호라면 이동
                    if (page && page >= 1) {
                        goToPage(page);
                    }
                }
            });
        }
        
        // 초기 화면 렌더링
        if (allPosts.length > 0) {
            updateDisplay();
        }
        
        // GSAP 애니메이션 (라이브러리가 있을 경우)
        if (typeof gsap !== 'undefined') {
            initAnimations();
        }
    }
    
    // =========================================
    // 4. 기능 함수들
    // =========================================

    function toggleView() {
        // 태그 페이지로 이동 (간단 보기)
        window.location.href = '/tags';
    }
    
    function changePostsPerPage() {
        const value = postsPerPageSelect.value;
        const newPostsPerPage = value === 'all' ? filteredPosts.length : parseInt(value);
        
        // 현재 보고 있는 포스트가 유지되도록 페이지 재계산
        const currentFirstPostIndex = (currentPage - 1) * postsPerPage;
        const newPage = Math.floor(currentFirstPostIndex / newPostsPerPage) + 1;
        
        postsPerPage = newPostsPerPage;
        currentPage = Math.max(1, Math.min(newPage, Math.ceil(filteredPosts.length / postsPerPage)));
        
        updateDisplay();
    }
    
    // 화면 업데이트 메인 로직
    function updateDisplay() {
        const totalPosts = filteredPosts.length;
        
        // 검색 결과가 없을 때
        if (totalPosts === 0) {
            allPosts.forEach(post => post.style.display = 'none');
            updateStats(0, 0, 0);
            updatePagination(0);
            return;
        }
        
        const totalPages = Math.ceil(totalPosts / postsPerPage);
        
        // 페이지 범위 보정
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;
        
        // 일단 모든 포스트 숨김
        allPosts.forEach(post => post.style.display = 'none');
        
        // 현재 페이지에 해당하는 포스트만 표시
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = Math.min(startIndex + postsPerPage, totalPosts);
        
        for (let i = startIndex; i < endIndex; i++) {
            if (filteredPosts[i]) {
                filteredPosts[i].style.display = '';
            }
        }
        
        // UI 구성요소 업데이트
        updatePagination(totalPages);
        updateLoadMoreButton(totalPosts, endIndex);
        updateStats(totalPosts, startIndex + 1, endIndex);
    }
    
    // ✅ [핵심 수정] 페이지네이션 HTML 생성 (innerHTML 교체 방식)
    function updatePagination(totalPages) {
        if (!paginationContainer || !pagination) return;
        
        // 페이지가 1개 이하이거나, '모두 보기' 상태면 페이지네이션 숨김
        if (postsPerPage >= filteredPosts.length || totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }
        
        paginationContainer.style.display = 'block';
        if (loadMoreBtn) loadMoreBtn.style.display = 'none'; // 페이지네이션 활성화 시 더보기 숨김
        
        let paginationHTML = '';
        
        // [이전] 버튼
        paginationHTML += `
          <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${Math.max(1, currentPage - 1)}" aria-label="이전">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
        `;
        
        // 표시할 페이지 범위 계산 (최대 5개)
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // 1번 페이지 및 줄임표
        if (startPage > 1) {
            paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="1">1</a></li>`;
            if (startPage > 2) {
                paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
        }
        
        // 페이지 번호 생성
        for (let i = startPage; i <= endPage; i++) {
            // active 클래스 적용
            paginationHTML += `
              <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
              </li>
            `;
        }
        
        // 마지막 페이지 및 줄임표
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
            paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a></li>`;
        }
        
        // [다음] 버튼
        paginationHTML += `
          <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${Math.min(totalPages, currentPage + 1)}" aria-label="다음">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        `;
        
        // DOM 교체 (복제 로직 제거됨)
        pagination.innerHTML = paginationHTML;
    }
    
    function updateLoadMoreButton(totalPosts, currentEndIndex) {
        if (!loadMoreBtn) return;
        
        const remaining = totalPosts - currentEndIndex;
        
        // 남은 포스트가 있고 페이지네이션 모드가 아닐 때 (기본 10개씩 볼 때 등)
        // 하지만 updatePagination에서 페이지네이션이 활성화되면 더보기 버튼은 숨겨짐
        if (remaining > 0 && paginationContainer.style.display === 'none') {
            loadMoreBtn.style.display = 'block';
            const loadMoreCount = document.querySelector('.load-more-count');
            if (loadMoreCount) {
                loadMoreCount.textContent = `(${remaining}개 더)`;
            }
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }
    
    function loadMore() {
        if (!loadMoreBtn) return;
        
        loadMoreBtn.disabled = true;
        loadMoreBtn.classList.add('loading');
        
        setTimeout(() => {
            postsPerPage += 10;
            updateDisplay();
            loadMoreBtn.disabled = false;
            loadMoreBtn.classList.remove('loading');
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
            
            // 목록 상단으로 스크롤
            const postListEl = document.querySelector('.home');
            if (postListEl) {
                postListEl.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        }, 300);
    }
    
    function updateStats(total, start, end) {
        const searchStats = document.getElementById('searchStats');
        if (!searchStats) return;
        
        if (searchInput && searchInput.value.trim()) {
            searchStats.textContent = `${total}개의 검색 결과 중 ${start}-${end}번째`;
        } else {
            searchStats.textContent = `총 ${total}개의 포스트 중 ${start}-${end}번째`;
        }
    }
    
    // =========================================
    // 5. 검색 로직
    // =========================================
    function initSearch() {
        if (!searchInput) return;
        
        let searchTimeout;
        
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(e.target.value);
            }, 300);
        });
        
        const clearButton = document.getElementById('clearSearch');
        if (clearButton) {
            clearButton.addEventListener('click', function() {
                searchInput.value = '';
                searchInput.focus();
                performSearch('');
            });
        }
    }
    
    function performSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (!searchTerm) {
            filteredPosts = [...allPosts];
        } else {
            filteredPosts = allPosts.filter(item => {
                // 데이터셋 속성 안전하게 가져오기
                const title = (item.dataset.title || '').toLowerCase();
                const content = (item.dataset.content || '').toLowerCase();
                const tags = (item.dataset.tags || '').toLowerCase();
                
                return title.includes(searchTerm) || 
                       content.includes(searchTerm) || 
                       tags.includes(searchTerm);
            });
        }
        
        currentPage = 1;
        updateDisplay();
        
        // 검색 결과 없음 메시지 처리
        const noResults = document.getElementById('noResults');
        if (noResults) {
            noResults.style.display = searchTerm && filteredPosts.length === 0 ? 'block' : 'none';
        }
        
        // 클리어 버튼 표시 여부
        const clearButton = document.getElementById('clearSearch');
        if (clearButton) {
            clearButton.style.display = searchTerm ? 'block' : 'none';
        }
    }
    
    // =========================================
    // 6. 애니메이션 (GSAP)
    // =========================================
    function initAnimations() {
        if (typeof ScrollTrigger === 'undefined') {
             gsap.registerPlugin(ScrollTrigger);
        }
        
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