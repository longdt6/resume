// Restores the known-good resume content into the active CodeMirror 6 editor in Overleaf.
// Reads from /Users/dolong/Documents/resume-update/resume.tex (verified to compile clean).
async (page) => {
  const fs = await import('node:fs');
  const newContent = fs.readFileSync(
    '/Users/dolong/Documents/resume-update/resume.tex',
    'utf8'
  );

  await page.waitForSelector('.cm-content', { timeout: 20000 });

  const result = await page.evaluate((text) => {
    const contentEl = document.querySelector('.cm-content');
    const view = contentEl && contentEl.cmView && contentEl.cmView.view;
    if (!view) return { ok: false, reason: 'No CM6 view found' };
    const prevLen = view.state.doc.length;
    view.dispatch({ changes: { from: 0, to: prevLen, insert: text } });
    const newLen = view.state.doc.length;
    return {
      ok: true,
      prevLen,
      newLen,
      preview: view.state.doc.slice(0, 50).toString(),
      tail: view.state.doc.slice(-60).toString()
    };
  }, newContent);

  return result;
}
