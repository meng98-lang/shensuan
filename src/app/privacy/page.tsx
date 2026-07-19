export default function PrivacyPage() {
  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#f5f5dc' }}>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <a href="/" className="text-green-600 hover:underline mb-4 inline-block">← 返回首頁</a>
        <h1 className="text-3xl font-bold mb-6" style={{ color: '#4a7c59' }}>隱私條例</h1>
        <div className="prose space-y-4">
          <h2 className="text-xl font-semibold">資訊收集</h2>
          <p>我們不會主動收集您的個人資料。當您通過 Line 或 WhatsApp 與我們聯繫時，相關平台可能會收集您的資訊。</p>
          
          <h2 className="text-xl font-semibold">資訊使用</h2>
          <p>您的資訊僅用於回覆您的諮詢，不會用於其他用途。</p>
          
          <h2 className="text-xl font-semibold">資訊保護</h2>
          <p>我們會妥善保護您的隱私，不會向第三方透露您的資訊。</p>
          
          <h2 className="text-xl font-semibold">Cookie</h2>
          <p>本網站可能使用 Cookie 來改善用戶體驗。您可以通過瀏覽器設定控制 Cookie 的使用。</p>
          
          <h2 className="text-xl font-semibold">第三方連結</h2>
          <p>本網站包含第三方平台（Line、WhatsApp）的連結，這些平台有自己的隱私政策。</p>
        </div>
      </div>
    </div>
  );
}
