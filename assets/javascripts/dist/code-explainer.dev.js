"use strict";

document.querySelectorAll('pre code').forEach(function (codeBlock) {
  codeBlock.addEventListener('mouseenter', showExplainButton);
  codeBlock.addEventListener('mouseleave', hideExplainButton);
});

function explainCode(codeText) {
  var response;
  return regeneratorRuntime.async(function explainCode$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(fetch('/api/explain-code', {
            method: 'POST',
            body: JSON.stringify({
              code: codeText
            })
          }));

        case 2:
          response = _context.sent;

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
}