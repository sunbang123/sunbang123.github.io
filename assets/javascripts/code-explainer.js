document.querySelectorAll('pre code').forEach(codeBlock => {
    codeBlock.addEventListener('mouseenter', showExplainButton);
    codeBlock.addEventListener('mouseleave', hideExplainButton);
});

async function explainCode(codeText) {
    const response = await fetch('/api/explain-code', {
        method: 'POST',
        body: JSON.stringify({ code: codeText })
    });
    // AI API 호출해서 설명 받아오기
}