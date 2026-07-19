'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Contact {
  id: string;
  platform: string;
  displayName: string;
  link: string;
  enabled: boolean;
}

interface Settings {
  siteName: string;
  avatarUrl: string;
  backgroundColor: string;
  themeColor: string;
  noteText: string;
}

interface Pixel {
  id: string;
  type: string;
  name: string;
  pixelId: string;
  customCode: string;
  enabled: boolean;
}

interface ClickStats {
  contactId: string;
  platform: string;
  name: string;
  totalClicks: number;
  todayClicks: number;
  weekClicks: number;
  lastClick: string | null;
}

interface StatsSummary {
  totalClicks: number;
  todayClicks: number;
  totalContacts: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'contacts' | 'settings' | 'pixels' | 'stats'>('contacts');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [settings, setSettings] = useState<Settings>({
    siteName: '',
    avatarUrl: '',
    backgroundColor: '#f5f5dc',
    themeColor: '#4a7c59',
    noteText: ''
  });
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [stats, setStats] = useState<ClickStats[]>([]);
  const [statsSummary, setStatsSummary] = useState<StatsSummary>({
    totalClicks: 0,
    todayClicks: 0,
    totalContacts: 0
  });

  // 新增联系方式表单
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({
    platform: 'line',
    displayName: '',
    link: ''
  });

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (!auth) {
      router.push('/admin');
      return;
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === 'stats') {
      fetchStats();
    }
  }, [activeTab]);

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

  const fetchStats = async () => {
    const res = await fetch('/api/stats');
    const data = await res.json();
    if (data.success) {
      setStats(data.data.clicks || []);
      setStatsSummary({
        totalClicks: data.data.total || 0,
        todayClicks: data.data.today || 0,
        totalContacts: contacts.filter(c => c.enabled).length
      });
    }
  };

  const handleAddContact = async () => {
    if (!newContact.displayName || !newContact.link) {
      alert('請填寫顯示名稱和連結');
      return;
    }

    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newContact, enabled: true })
    });
    setContacts(await res.json());
    setNewContact({ platform: 'line', displayName: '', link: '' });
    setShowAddForm(false);
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
    // Save each pixel individually
    for (const pixel of pixels) {
      await fetch('/api/pixels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pixel)
      });
    }
    alert('像素代碼已保存');
  };

  const handleAddPixel = async (type: string, name: string) => {
    const res = await fetch('/api/pixels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, name, pixelId: '', customCode: '', enabled: true })
    });
    if (res.ok) {
      const data = await res.json();
      setPixels([...pixels, data]);
    }
  };

  const handleDeletePixel = async (id: string) => {
    const res = await fetch('/api/pixels', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (res.ok) {
      setPixels(pixels.filter(p => p.id !== id));
    }
  };

  const handleUpdatePixel = async (pixel: Pixel) => {
    const res = await fetch('/api/pixels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pixel)
    });
    if (res.ok) {
      setPixels(pixels.map(p => p.id === pixel.id ? pixel : p));
    }
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
          <button
            onClick={() => setActiveTab('stats')}
            className={`pb-2 px-4 ${activeTab === 'stats' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'}`}
          >
            點擊統計
          </button>
        </div>

        {activeTab === 'contacts' && (
          <div>
            <button 
              onClick={() => setShowAddForm(!showAddForm)} 
              className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              + 新增聯繫方式
            </button>

            {showAddForm && (
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">平台</label>
                  <select
                    value={newContact.platform}
                    onChange={(e) => setNewContact({ ...newContact, platform: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="line">Line</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="telegram">Telegram</option>
                    <option value="wechat">微信</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">顯示名稱</label>
                  <input
                    type="text"
                    value={newContact.displayName}
                    onChange={(e) => setNewContact({ ...newContact, displayName: e.target.value })}
                    placeholder="例如：通過 Line 與我聯繫"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">連結</label>
                  <input
                    type="text"
                    value={newContact.link}
                    onChange={(e) => setNewContact({ ...newContact, link: e.target.value })}
                    placeholder="例如：https://line.me/R/ti/p/@yourid"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddContact}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    取消
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {contacts.map(contact => (
                <div key={contact.id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                  <div>
                    <span className="font-medium">{contact.displayName}</span>
                    <span className={`ml-2 text-xs px-2 py-1 rounded ${contact.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {contact.enabled ? '啟用' : '停用'}
                    </span>
                  </div>
                  <div className="space-x-2">
                    <button onClick={() => handleToggleContact(contact.id)} className="text-sm text-blue-600 hover:underline">
                      {contact.enabled ? '停用' : '啟用'}
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
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              {settings.avatarUrl && (
                <div className="mt-2">
                  <img src={settings.avatarUrl} alt="头像预览" className="w-20 h-20 rounded-full object-cover" />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">背景顏色</label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
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
                value={settings.noteText}
                onChange={(e) => setSettings({ ...settings, noteText: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={handleSaveSettings}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              保存設定
            </button>
          </div>
        )}

        {activeTab === 'pixels' && (
          <div className="space-y-4">
            <div className="flex gap-2 mb-4">
              <button onClick={() => handleAddPixel('google', 'Google Analytics')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                + Google Analytics
              </button>
              <button onClick={() => handleAddPixel('facebook', 'Facebook Pixel')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                + Facebook Pixel
              </button>
              <button onClick={() => handleAddPixel('tiktok', 'TikTok Pixel')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                + TikTok Pixel
              </button>
              <button onClick={() => handleAddPixel('custom', '自訂代碼')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                + 自訂代碼
              </button>
            </div>

            {pixels.map((pixel) => (
              <div key={pixel.id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{pixel.name}</span>
                    <span className={`text-xs px-2 py-1 rounded ${pixel.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {pixel.enabled ? '啟用' : '停用'}
                    </span>
                  </div>
                  <div className="space-x-2">
                    <button onClick={() => handleUpdatePixel({ ...pixel, enabled: !pixel.enabled })} className="text-sm text-blue-600 hover:underline">
                      {pixel.enabled ? '停用' : '啟用'}
                    </button>
                    <button onClick={() => handleDeletePixel(pixel.id)} className="text-sm text-red-600 hover:underline">
                      刪除
                    </button>
                  </div>
                </div>
                {pixel.type !== 'custom' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pixel ID</label>
                    <input
                      type="text"
                      value={pixel.pixelId}
                      onChange={(e) => handleUpdatePixel({ ...pixel, pixelId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">自訂代碼</label>
                    <textarea
                      value={pixel.customCode}
                      onChange={(e) => handleUpdatePixel({ ...pixel, customCode: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                    />
                  </div>
                )}
              </div>
            ))}

            {pixels.length === 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
                暫無像素代碼，請點擊上方按鈕新增
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* 总体统计 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600 mb-1">總點擊數</div>
                <div className="text-3xl font-bold text-green-600">{statsSummary.totalClicks}</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600 mb-1">今日點擊</div>
                <div className="text-3xl font-bold text-blue-600">{statsSummary.todayClicks}</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600 mb-1">活躍聯繫方式</div>
                <div className="text-3xl font-bold text-purple-600">{statsSummary.totalContacts}</div>
              </div>
            </div>

            {/* 详细统计 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">各聯繫方式點擊統計</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">平台</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">名稱</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">總點擊</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">今日</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">近 7 天</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">最後點擊</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stats.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          暫無點擊數據
                        </td>
                      </tr>
                    ) : (
                      stats.map((stat) => (
                        <tr key={stat.contactId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {stat.platform}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stat.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold">{stat.totalClicks}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-blue-600 font-semibold">{stat.todayClicks}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-purple-600 font-semibold">{stat.weekClicks}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {stat.lastClick ? new Date(stat.lastClick).toLocaleString('zh-TW') : '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 刷新按钮 */}
            <div className="flex justify-end">
              <button
                onClick={fetchStats}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                刷新數據
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
