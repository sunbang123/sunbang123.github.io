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
    
    // 필수 요소가 없으면 초기화 중단
    if (!postList || !toggleViewBtn) {
        console.log('필수 요소가 없습니다. 스크립트 종료.');
        return;
    }
    
    // 초기화
    init();
    
    function init() {
        allPosts = Array.from(postItems);
        filteredPosts = [...allPosts];
        
        // 이벤트 리스너
        toggleViewBtn.addEventListener('click', toggleView);
        
        if (postsPerPageSelect) {
            postsPerPageSelect.addEventListener('change', changePostsPerPage);
        }
        
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', loadMore);
        }
        
        // 초기 페이징 설정
        if (allPosts.length > 0) {
            updateDisplay();
            initSearch();
        }
        
        // 애니메이션 초기화
        if (typeof gsap !== 'undefined') {
            initAnimations();
        }
    }
    
    function toggleView() {
        // 간단하게 태그 페이지로 이동
        window.location.href = '/tags';
    }
    
    function changePostsPerPage() {
        const value = postsPerPageSelect.value;
        const newPostsPerPage = value === 'all' ? filteredPosts.length : parseInt(value);
        
        const currentFirstPostIndex = (currentPage - 1) * postsPerPage;
        const newPage = Math.floor(currentFirstPostIndex / newPostsPerPage) + 1;
        
        postsPerPage = newPostsPerPage;
        currentPage = Math.max(1, Math.min(newPage, Math.ceil(filteredPosts.length / postsPerPage)));
        
        updateDisplay();
    }
    
    function updateDisplay() {
        const totalPosts = filteredPosts.length;
        
        if (totalPosts === 0) {
            allPosts.forEach(post => post.style.display = 'none');
            updateStats(0, 0, 0);
            updatePagination(0);
            return;
        }
        
        const totalPages = Math.ceil(totalPosts / postsPerPage);
        
        if (currentPage > totalPages) {
            currentPage = totalPages;
        }
        if (currentPage < 1) {
            currentPage = 1;
        }
        
        allPosts.forEach(post => post.style.display = 'none');
        
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = Math.min(startIndex + postsPerPage, totalPosts);
        
        for (let i = startIndex; i < endIndex; i++) {
            if (filteredPosts[i]) {
                filteredPosts[i].style.display = '';
            }
        }
        
        updatePagination(totalPages);
        updateLoadMoreButton(totalPosts, endIndex);
        updateStats(totalPosts, startIndex + 1, endIndex);
    }
    
    function updatePagination(totalPages) {
        if (!paginationContainer || !pagination) return;
        
        if (postsPerPage >= filteredPosts.length || totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }
        
        paginationContainer.style.display = 'block';
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        
        if (currentPage > totalPages) {
            currentPage = totalPages;
        }
        
        let paginationHTML = '';
        
        paginationHTML += `
          <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${Math.max(1, currentPage - 1)}" aria-label="이전">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
        `;
        
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
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
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
            paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a></li>`;
        }
        
        paginationHTML += `
          <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${Math.min(totalPages, currentPage + 1)}" aria-label="다음">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        `;
        
        pagination.innerHTML = paginationHTML;
        
        const newPagination = pagination.cloneNode(true);
        pagination.parentNode.replaceChild(newPagination, pagination);
        
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
        if (!loadMoreBtn) return;
        
        const remaining = totalPosts - currentEndIndex;
        
        if (remaining > 0 && postsPerPage < filteredPosts.length) {
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
        const visiblePosts = allPosts.filter(post => post.style.display !== 'none');
        visiblePosts.forEach(post => post.classList.add('fade-out'));
        
        setTimeout(() => {
            currentPage = page;
            updateDisplay();
            
            const newVisiblePosts = allPosts.filter(post => post.style.display !== 'none');
            newVisiblePosts.forEach(post => {
                post.classList.remove('fade-out');
                post.classList.add('fade-in');
            });
            
            const postListEl = document.querySelector('.post-list');
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
            if (total === allPosts.length) {
                searchStats.textContent = `총 ${total}개의 포스트 중 ${start}-${end}번째`;
            } else {
                searchStats.textContent = `${total}개의 검색 결과 중 ${start}-${end}번째`;
            }
        }
    }
    
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
        
        const noResults = document.getElementById('noResults');
        if (noResults) {
            noResults.style.display = searchTerm && filteredPosts.length === 0 ? 'block' : 'none';
        }
        
        const clearButton = document.getElementById('clearSearch');
        if (clearButton) {
            clearButton.style.display = searchTerm ? 'block' : 'none';
        }
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