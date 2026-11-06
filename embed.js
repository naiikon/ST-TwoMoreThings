import { initialize } from './dist/runtime.js';

// 随卡入口仅由加载脚本显式调用；导入共享核心不会再启动独立扩展。
export function mountEmbedded({ preset, host, documentRef = document, release, updateError } = {}) {
  const options = { mode: 'embedded', preset, documentRef, ...(host ? { host } : {}) };
  async function replaceCore(coreUrl, nextRelease) {
    let next;
    try { next = await import(new URL('./dist/runtime.js', coreUrl).href); }
    catch { throw new Error('Tải bản điện thoại mới thất bại, điện thoại hiện tại vẫn dùng được, hãy cập nhật lại sau.'); }
    if (typeof next.initialize !== 'function') throw new Error('Bản điện thoại mới tải chưa đầy đủ, điện thoại hiện tại vẫn dùng được, hãy cập nhật lại sau.');
    app.dispose({ preserveQuickReply: true });
    try {
      app = next.initialize({ ...options, coreUrl, release: nextRelease, replaceCore });
      app.open();
    } catch { throw new Error('Khởi động bản điện thoại mới thất bại, hãy tải lại script đi kèm card. Nội dung điện thoại đã có được giữ lại.'); }
  }
  let app = initialize({ ...options, coreUrl: import.meta.url, release, updateError, replaceCore });
  return { open: () => app.open(), dispose: () => app.dispose() };
}
