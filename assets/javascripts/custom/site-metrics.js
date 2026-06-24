(function () {
    const storageKey = 'sunbang-site-visits-v1';

    function readRecords() {
        try {
            return JSON.parse(localStorage.getItem(storageKey)) || {};
        } catch (_) {
            return {};
        }
    }

    function writeRecords(records) {
        localStorage.setItem(storageKey, JSON.stringify(records));
    }

    function getToday() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }

    function trackVisit() {
        const records = readRecords();
        const path = window.location.pathname || '/';
        const today = getToday();
        const now = new Date().toISOString();
        const title = document.querySelector('h1')?.textContent?.trim() || document.title.replace(' | Tech Blog 👩‍💻', '').trim() || path;

        records[path] = records[path] || {
            path,
            title,
            count: 0,
            firstVisitedAt: now,
            lastVisitedAt: now,
            days: {}
        };

        records[path].title = title;
        records[path].count += 1;
        records[path].lastVisitedAt = now;
        records[path].days[today] = (records[path].days[today] || 0) + 1;
        writeRecords(records);
    }

    function formatDate(value) {
        if (!value) return '-';
        return new Intl.DateTimeFormat('ko-KR', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(value));
    }

    function renderRecords() {
        const list = document.getElementById('visitRecordsList');
        if (!list) return;

        const records = readRecords();
        const today = getToday();
        const items = Object.values(records).sort((a, b) => new Date(b.lastVisitedAt) - new Date(a.lastVisitedAt));
        const total = items.reduce((sum, item) => sum + item.count, 0);
        const todayTotal = items.reduce((sum, item) => sum + (item.days?.[today] || 0), 0);

        document.getElementById('visitTotalCount').textContent = total;
        document.getElementById('visitTodayCount').textContent = todayTotal;
        document.getElementById('visitPageCount').textContent = items.length;

        if (!items.length) {
            list.innerHTML = '<p>아직 저장된 방문 기록이 없습니다.</p>';
            return;
        }

        list.innerHTML = items.slice(0, 12).map((item) => `
            <a class="visit-record-item" href="${item.path}">
                <span>${item.count}회</span>
                <strong>${item.title}</strong>
                <small>최근 ${formatDate(item.lastVisitedAt)}</small>
            </a>
        `).join('');
    }

    function bindReset() {
        const button = document.getElementById('visitResetButton');
        if (!button) return;

        button.addEventListener('click', () => {
            localStorage.removeItem(storageKey);
            renderRecords();
        });
    }

    function getIssuePageHref(issue) {
        const title = issue.title || '';
        if (title.startsWith('/')) {
            return `${title.split(' ')[0]}#utterances`;
        }

        return issue.html_url;
    }

    function createCommentCard(comment) {
        const article = document.createElement('article');
        article.className = 'comment-record-item';

        const header = document.createElement('div');
        header.className = 'comment-record-item__header';

        const avatar = document.createElement('img');
        avatar.src = comment.avatarUrl;
        avatar.alt = `${comment.author} 프로필 이미지`;
        avatar.loading = 'lazy';

        const meta = document.createElement('div');

        const author = document.createElement('strong');
        author.textContent = comment.author;

        const time = document.createElement('time');
        time.dateTime = comment.createdAt;
        time.textContent = formatDate(comment.createdAt);

        meta.append(author, time);
        header.append(avatar, meta);

        const source = document.createElement('a');
        source.className = 'comment-record-item__source';
        source.href = comment.pageHref;
        source.textContent = comment.issueTitle;

        const body = document.createElement('p');
        body.className = 'comment-record-item__body';
        body.textContent = comment.body || '(내용 없는 댓글)';

        const action = document.createElement('a');
        action.className = 'comment-record-item__action';
        action.href = comment.url;
        action.target = '_blank';
        action.rel = 'noopener noreferrer';
        action.textContent = 'GitHub에서 열기';

        article.append(header, source, body, action);
        return article;
    }

    async function fetchJson(url) {
        const response = await fetch(url, {
            headers: {
                Accept: 'application/vnd.github+json'
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API ${response.status}`);
        }

        return response.json();
    }

    async function renderComments() {
        const list = document.getElementById('commentRecordsList');
        if (!list) return;

        const totalCount = document.getElementById('commentTotalCount');
        const issueCount = document.getElementById('commentIssueCount');
        const repo = 'sunbang123/sunbang123.github.io';
        const issuesUrl = `https://api.github.com/repos/${repo}/issues?state=all&sort=updated&direction=desc&per_page=100`;

        try {
            const issues = await fetchJson(issuesUrl);
            const commentIssues = issues.filter((issue) => !issue.pull_request && issue.comments > 0);
            const commentGroups = await Promise.all(commentIssues.slice(0, 24).map(async (issue) => {
                const comments = await fetchJson(`${issue.comments_url}?per_page=100`);
                return comments.map((comment) => ({
                    author: comment.user?.login || 'unknown',
                    avatarUrl: comment.user?.avatar_url || '',
                    body: comment.body || '',
                    createdAt: comment.created_at,
                    issueTitle: issue.title || '댓글 원문',
                    pageHref: getIssuePageHref(issue),
                    url: comment.html_url
                }));
            }));
            const comments = commentGroups.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            if (totalCount) totalCount.textContent = comments.length;
            if (issueCount) issueCount.textContent = `${commentIssues.length}개 이슈`;

            if (!comments.length) {
                list.replaceChildren();
                const empty = document.createElement('p');
                empty.textContent = '아직 불러올 댓글이 없습니다.';
                list.append(empty);
                return;
            }

            list.replaceChildren(...comments.slice(0, 10).map(createCommentCard));
        } catch (error) {
            if (totalCount) totalCount.textContent = '0';
            list.replaceChildren();
            const message = document.createElement('p');
            message.textContent = '댓글을 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.';
            list.append(message);
        }
    }

    trackVisit();
    renderRecords();
    renderComments();
    bindReset();
})();
