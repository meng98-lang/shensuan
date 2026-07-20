export default function AboutPage() {
  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#f5f5dc' }}>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <a href="/" className="text-green-600 hover:underline mb-4 inline-block">← 返回首頁</a>
        <h1 className="text-3xl font-bold mb-6" style={{ color: '#4a7c59' }}>關於我們</h1>
        <div className="prose">
          <p className="mb-4">靜安師傅，專業諮詢服務。</p>
          <p className="mb-4">我們提供準確的命理分析和指導，幫助您了解人生方向。</p>
          <p>如有任何問題，歡迎通過 Line 或 WhatsApp 與我們聯繫。</p>
        </div>
      </div>
    </div>
  );
}
