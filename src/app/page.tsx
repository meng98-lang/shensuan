import { getSettings, getContacts } from '@/lib/db';
import TrackingScripts from '@/components/tracking-scripts';
import ContactButton from '@/components/contact-button';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const settings = await getSettings();
  const contacts = await getContacts();
  const activeContacts = contacts.filter(c => c.enabled);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: settings.backgroundColor }}>
      <TrackingScripts />
      
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-300 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* 头像 */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img 
              src={settings.avatarUrl} 
              alt={settings.siteName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 标题 */}
        <h1 className="text-3xl font-bold text-center mb-8" style={{ color: settings.themeColor }}>
          {settings.siteName}
        </h1>

        {/* 联系按钮 */}
        <div className="space-y-4 mb-8">
          {activeContacts.map(contact => (
            <ContactButton key={contact.id} contact={contact} themeColor={settings.themeColor} />
          ))}
        </div>

        {/* 备注 */}
        {settings.noteText && (
          <p className="text-center text-gray-600 text-sm whitespace-pre-line">
            {settings.noteText}
          </p>
        )}

        {/* 底部链接 */}
        <div className="mt-12 pt-6 border-t border-gray-300">
          <div className="flex justify-center space-x-6 text-sm">
            <a href="/about" className="text-gray-600 hover:text-gray-900">關於我們</a>
            <a href="/contact" className="text-gray-600 hover:text-gray-900">聯繫我們</a>
            <a href="/privacy" className="text-gray-600 hover:text-gray-900">隱私條例</a>
          </div>
        </div>
      </div>
    </div>
  );
}
