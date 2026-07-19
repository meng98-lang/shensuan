'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Contact {
  id: string;
  platform: string;
  displayName: string;
  link: string;
  active: boolean;
}

interface Settings {
  siteName: string;
  avatarUrl: string;
  bgColor: string;
  themeColor: string;
  note: string;
}

interface Pixels {
  googleAnalytics: string;
  facebookPixel: string;
  tiktokPixel: string;
  customCode: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'contacts' | 'settings' | 'pixels'>('contacts');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [settings, setSettings] = useState<Settings>({
    siteName: '',
    avatarUrl: '',
    bgColor: '#f5f5dc',
    themeColor: '#4a7c59',
    note: ''
  });
  const [pixels, setPixels] = useState<Pixels>({
    googleAnalytics: '',
    facebookPixel: '',
    tiktokPixel: '',
    customCode: ''
  });

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (!auth) {
      router.push('/admin');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    const [contactsRes, settingsRes, pixelsRes] = await Promise.all([
      fetch('/api/contacts'),
      fetch('/api/settings'),
      fetch('/api/pixels')
    ]);
    setContacts(await contactsRes.json());
    setSettings(await settingsRes.json());
    setPixels(await pixelsRes.json());
  };

  const handleAddContact = async () => {
    const platform = prompt('平台 (line/whatsapp/telegram/wechat):');
    if (!platform) return;
    const displayName = prompt('顯示名稱:');
    if (!displayName) return;
    const link = prompt('連結:');
    if (!link) return;

    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform, displayName, link, active: true })
    });
    setContacts(await res.json());
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm('確定刪除？')) return;
    const res = await fetch('/api/contacts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    setContacts(await res.json());
  };

  const handleToggleContact = async (id: string) => {
    const res = await fetch('/api/contacts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    setContacts(await res.json());
  };

  const handleSaveSettings = async () => {
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    alert('設定已保存');
  };

  const handleSavePixels = async () => {
    await fetch('/api/pixels', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pixels)
    });
    alert('像素代碼已保存');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">神算黃鐵口 - 管理後台</h1>
          <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-gray-900">登出</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex space-x-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('contacts')}
            className={`pb-2 px-4 ${activeTab === 'contacts' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'}`}
          >
            聯繫方式
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-2 px-4 ${activeTab === 'settings' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'}`}
          >
            網站設定
          </button>
          <button
            onClick={() => setActiveTab('pixels')}
            className={`pb-2 px-4 ${activeTab === 'pixels' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'}`}
          >
            像素代碼
          </button>
        </div>

        {activeTab === 'contacts' && (
          <div>
            <button onClick={handleAddContact} className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              + 新增聯繫方式
            </button>
            <div className="space-y-2">
              {contacts.map(contact => (
                <div key={contact.id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                  <div>
                    <span className="font-medium">{contact.displayName}</span>
                    <span className={`ml-2 text-xs px-2 py-1 rounded ${contact.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {contact.active ? '啟用' : '停用'}
                    </span>
                  </div>
                  <div className="space-x-2">
                    <button onClick={() => handleToggleContact(contact.id)} className="text-sm text-blue-600 hover:underline">
                      {contact.active ? '停用' : '啟用'}
                    </button>
                    <button onClick={() => handleDeleteContact(contact.id)} className="text-sm text-red-600 hover:underline">
                      刪除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">網站名稱</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">頭像 URL</label>
              <input
                type="text"
                value={settings.avatarUrl}
                onChange={(e) => setSettings({ ...settings, avatarUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">背景顏色</label>
                <input
                  type="color"
                  value={settings.bgColor}
                  onChange={(e) => setSettings({ ...settings, bgColor: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">主題顏色</label>
                <input
                  type="color"
                  value={settings.themeColor}
                  onChange={(e) => setSettings({ ...settings, themeColor: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">備註文字</label>
              <textarea
                value={settings.note}
                onChange={(e) => setSettings({ ...settings, note: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                rows={3}
              />
            </div>
            <button onClick={handleSaveSettings} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              保存設定
            </button>
          </div>
        )}

        {activeTab === 'pixels' && (
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics (G-ID)</label>
              <input
                type="text"
                value={pixels.googleAnalytics}
                onChange={(e) => setPixels({ ...pixels, googleAnalytics: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="G-XXXXXXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Pixel ID</label>
              <input
                type="text"
                value={pixels.facebookPixel}
                onChange={(e) => setPixels({ ...pixels, facebookPixel: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="1234567890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">TikTok Pixel ID</label>
              <input
                type="text"
                value={pixels.tiktokPixel}
                onChange={(e) => setPixels({ ...pixels, tiktokPixel: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">自訂代碼</label>
              <textarea
                value={pixels.customCode}
                onChange={(e) => setPixels({ ...pixels, customCode: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                rows={6}
                placeholder="<script>...</script>"
              />
            </div>
            <button onClick={handleSavePixels} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              保存像素代碼
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
