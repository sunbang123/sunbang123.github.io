function initDevlogComposer() {
    const button = document.getElementById('devlogDraftButton');
    if (!button) return;

    const titleInput = document.getElementById('devlogTitleInput');
    const bodyInput = document.getElementById('devlogBodyInput');
    const tagsInput = document.getElementById('devlogTagsInput');
    const output = document.getElementById('devlogDraftOutput');

    button.addEventListener('click', async () => {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const title = titleInput.value.trim() || '오늘의 DevLog';
        const body = bodyInput.value.trim() || '오늘 작업한 내용을 여기에 정리합니다.';
        const tags = tagsInput.value
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
            .map((tag) => `"${tag}"`)
            .join(', ');

        const markdown = `---\ntitle: \"${title.replaceAll('"', '\\"')}\"\ndate: ${yyyy}-${mm}-${dd} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00 +0900\ntags: [${tags}]\n---\n\n${body}\n`;

        output.hidden = false;
        output.textContent = markdown;

        try {
            await navigator.clipboard.writeText(markdown);
            button.textContent = '초안 복사됨';
            setTimeout(() => {
                button.textContent = 'Markdown 초안 만들기';
            }, 1800);
        } catch (_) {
            button.textContent = '초안 생성됨';
            setTimeout(() => {
                button.textContent = 'Markdown 초안 만들기';
            }, 1800);
        }
    });
}

initDevlogComposer();
