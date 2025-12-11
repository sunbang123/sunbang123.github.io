document.addEventListener('DOMContentLoaded', () => {
  const categoryHeaders = document.querySelectorAll('.category-header');
  const tagButtons = document.querySelectorAll('.tag-cloud-item');
  const tagSections = document.querySelectorAll('.tag-section');
  const infoMessage = document.getElementById('infoMessage');
  let activeTag = null;

  // 카테고리 접기/펼치기
  categoryHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const categoryId = header.dataset.category;
      const content = document.querySelector(`[data-category-content="${categoryId}"]`);
      const icon = header.querySelector('.category-icon');

      if (content.style.display === 'none') {
        content.style.display = 'flex';
        icon.textContent = '▼';
        header.classList.add('expanded');
      } else {
        content.style.display = 'none';
        icon.textContent = '▶';
        header.classList.remove('expanded');
      }
    });
  });

  // 태그 클릭
  tagButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tagId = button.dataset.tag;
      const targetSection = document.getElementById(tagId);

      if (!targetSection) return;

      if (activeTag === tagId) {
        closeActiveTag();
        return;
      }

      tagButtons.forEach(btn => btn.classList.remove('active'));
      tagSections.forEach(section => section.style.display = 'none');

      button.classList.add('active');
      targetSection.style.display = 'block';
      activeTag = tagId;
      infoMessage.classList.add('hidden');

      // 포스트 초기화 (처음 10개만 표시)
      initializePosts(targetSection);

      // 자동 스크롤 제거됨
    });
  });

  function initializePosts(section) {
    const postsGrid = section.querySelector('.posts-grid');
    const loadMoreBtn = section.querySelector('.btn-load-more');
    const postCards = postsGrid.querySelectorAll('.post-card');
    const initialShow = parseInt(postsGrid.dataset.initialShow) || 10;

    // 모든 포스트 숨기기
    postCards.forEach((card, index) => {
      if (index < initialShow) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });

    // 더보기 버튼 이벤트
    if (loadMoreBtn) {
      const newBtn = loadMoreBtn.cloneNode(true);
      loadMoreBtn.parentNode.replaceChild(newBtn, loadMoreBtn);
      
      newBtn.addEventListener('click', () => {
        loadMorePosts(section);
      });
    }
  }

  function loadMorePosts(section) {
    const postsGrid = section.querySelector('.posts-grid');
    const loadMoreBtn = section.querySelector('.btn-load-more');
    const postCards = postsGrid.querySelectorAll('.post-card');
    const loadCount = 10;

    let visibleCount = 0;
    postCards.forEach(card => {
      if (card.style.display !== 'none') visibleCount++;
    });

    let loaded = 0;
    postCards.forEach((card, index) => {
      if (index >= visibleCount && index < visibleCount + loadCount) {
        card.style.display = 'block';
        loaded++;
      }
    });

    visibleCount += loaded;
    const remaining = postCards.length - visibleCount;

    if (remaining <= 0) {
      loadMoreBtn.style.display = 'none';
    } else {
      const remainingSpan = loadMoreBtn.querySelector('.remaining-count');
      remainingSpan.textContent = `(${remaining}개 남음)`;
    }
  }

  function closeActiveTag() {
    tagButtons.forEach(btn => btn.classList.remove('active'));
    tagSections.forEach(section => section.style.display = 'none');
    activeTag = null;
    infoMessage.classList.remove('hidden');
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && activeTag) {
      closeActiveTag();
    }
  });
});