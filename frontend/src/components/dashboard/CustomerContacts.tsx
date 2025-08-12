'use client';

import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Clock, 
  User, 
  Home,
  DollarSign,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

interface CustomerContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  propertyType: string;
  budget: string;
  message: string;
  contactMethod: string;
  timestamp: string;
  status: 'new' | 'contacted' | 'closed';
}

const CustomerContacts: React.FC = () => {
  const [contacts, setContacts] = useState<CustomerContact[]>([]);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'closed'>('all');

  useEffect(() => {
    loadContacts();
    
    // Listen for new contacts
    const handleNewContact = () => {
      loadContacts();
    };
    
    window.addEventListener('customerContactAdded', handleNewContact);
    
    return () => {
      window.removeEventListener('customerContactAdded', handleNewContact);
    };
  }, []);

  const loadContacts = () => {
    const savedContacts = JSON.parse(localStorage.getItem('customerContacts') || '[]');
    setContacts(savedContacts);
  };

  const updateContactStatus = (contactId: string, newStatus: 'new' | 'contacted' | 'closed') => {
    const updatedContacts = contacts.map(contact => 
      contact.id === contactId ? { ...contact, status: newStatus } : contact
    );
    setContacts(updatedContacts);
    localStorage.setItem('customerContacts', JSON.stringify(updatedContacts));
  };

  const deleteContact = (contactId: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบข้อมูลการติดต่อนี้?')) {
      const updatedContacts = contacts.filter(contact => contact.id !== contactId);
      setContacts(updatedContacts);
      localStorage.setItem('customerContacts', JSON.stringify(updatedContacts));
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'ใหม่';
      case 'contacted': return 'ติดต่อแล้ว';
      case 'closed': return 'ปิดงาน';
      default: return status;
    }
  };

  const getContactMethodIcon = (method: string) => {
    switch (method) {
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'line': return <MessageCircle className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      default: return <Phone className="w-4 h-4" />;
    }
  };

  const filteredContacts = contacts.filter(contact => 
    filter === 'all' || contact.status === filter
  );

  const stats = {
    total: contacts.length,
    new: contacts.filter(c => c.status === 'new').length,
    contacted: contacts.filter(c => c.status === 'contacted').length,
    closed: contacts.filter(c => c.status === 'closed').length
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <MessageCircle className="w-6 h-6 mr-2 text-blue-600" />
          ติดต่อมาจากลูกค้า
        </h2>
        <div className="text-sm text-gray-500">
          ทั้งหมด {stats.total} รายการ
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-blue-700">ทั้งหมด</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.new}</div>
          <div className="text-sm text-red-700">ใหม่</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.contacted}</div>
          <div className="text-sm text-yellow-700">ติดต่อแล้ว</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.closed}</div>
          <div className="text-sm text-green-700">ปิดงาน</div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-2 mb-6">
        {[
          { key: 'all', label: 'ทั้งหมด' },
          { key: 'new', label: 'ใหม่' },
          { key: 'contacted', label: 'ติดต่อแล้ว' },
          { key: 'closed', label: 'ปิดงาน' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Contacts List */}
      <div className="space-y-4">
        {filteredContacts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>ยังไม่มีลูกค้าติดต่อมา</p>
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div key={contact.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(contact.timestamp)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                    {getStatusText(contact.status)}
                  </span>
                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="ลบ"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="w-4 h-4 text-green-600" />
                    <span className="font-medium">{contact.phone}</span>
                  </div>
                  {contact.email && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span>{contact.email}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm">
                    {getContactMethodIcon(contact.contactMethod)}
                    <span>ช่องทางที่สะดวก: {contact.contactMethod === 'phone' ? 'โทรศัพท์' : contact.contactMethod === 'line' ? 'Line' : 'อีเมล'}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {contact.propertyType && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Home className="w-4 h-4 text-purple-600" />
                      <span>สนใจ: {contact.propertyType}</span>
                    </div>
                  )}
                  {contact.budget && (
                    <div className="flex items-center space-x-2 text-sm">
                      <DollarSign className="w-4 h-4 text-yellow-600" />
                      <span>งบประมาณ: {contact.budget}</span>
                    </div>
                  )}
                </div>
              </div>

              {contact.message && (
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700">{contact.message}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2">
                {contact.status === 'new' && (
                  <button
                    onClick={() => updateContactStatus(contact.id, 'contacted')}
                    className="px-3 py-1 bg-yellow-600 text-white text-xs rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    ทำเครื่องหมายว่าติดต่อแล้ว
                  </button>
                )}
                {contact.status === 'contacted' && (
                  <button
                    onClick={() => updateContactStatus(contact.id, 'closed')}
                    className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                  >
                    ปิดงาน
                  </button>
                )}
                {contact.status === 'closed' && (
                  <button
                    onClick={() => updateContactStatus(contact.id, 'new')}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    เปิดงานใหม่
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomerContacts;