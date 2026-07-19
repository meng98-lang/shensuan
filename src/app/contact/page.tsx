import { getContacts } from '@/lib/db';

export default async function ContactPage() {
  const contacts = await getContacts();
  const activeContacts = contacts.filter(c => c.active);

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#f5f5dc' }}>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <a href="/" className="text-green-600 hover:underline mb-4 inline-block">← 返回首頁</a>
        <h1 className="text-3xl font-bold mb-6" style={{ color: '#4a7c59' }}>聯繫我們</h1>
        <div className="space-y-4">
          {activeContacts.map(contact => (
            <a
              key={contact.id}
              href={contact.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-3 px-6 rounded-lg text-white text-center font-semibold"
              style={{ 
                backgroundColor: contact.platform === 'line' ? '#06C755' : 
                               contact.platform === 'whatsapp' ? '#25D366' : '#4a7c59' 
              }}
            >
              {contact.displayName}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
