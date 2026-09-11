import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ContactFormModal } from './components/contacts/ContactFormModal';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ContactsPage } from './pages/ContactsPage';
import { ContactDetailsPage } from './pages/ContactDetailsPage';
import { EventsPage } from './pages/EventsPage';
import { TimelinePage } from './pages/TimelinePage';
import { MapPage } from './pages/MapPage';
import { NearbyContactsPage } from './pages/NearbyContactsPage';
import { SmartSuggestionsPage } from './pages/SmartSuggestionsPage';
import { RelationshipGraphPage } from './pages/RelationshipGraphPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { PrivacySettingsPage } from './pages/PrivacySettingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

import { Contact, NotificationItem, UserProfile } from './types';
import { fetchContacts, fetchNotifications } from './services/api';

export function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('icms_user_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(true);

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser?.isLoggedIn) {
      loadInitialData();
    }
  }, [currentUser]);

  const loadInitialData = async () => {
    const [cList, nList] = await Promise.all([fetchContacts(), fetchNotifications()]);
    setContacts(cList);
    setNotifications(nList);
  };

  const handleLogout = () => {
    localStorage.removeItem('icms_user_session');
    setCurrentUser(null);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleOpenEdit = (contact: Contact) => {
    setContactToEdit(contact);
    setShowAddModal(true);
  };

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setActiveTab('contact-details');
  };

  const handleContactSaved = async () => {
    setShowAddModal(false);
    setContactToEdit(null);
    const updated = await fetchContacts();
    setContacts(updated);
    if (selectedContact) {
      const refreshed = updated.find(c => c.id === selectedContact.id);
      if (refreshed) setSelectedContact(refreshed);
    }
  };

  // If user is not logged in, display the Login & User Registration page first
  if (!currentUser || !currentUser.isLoggedIn) {
    return <LoginPage onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'contact-details') setSelectedContact(null);
        }}
        unreadNotificationCount={unreadCount}
      />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={(q) => {
            setSearchQuery(q);
            if (q && activeTab !== 'contacts' && activeTab !== 'map' && activeTab !== 'nearby' && activeTab !== 'suggestions') {
              setActiveTab('contacts');
            }
          }}
          onOpenAddModal={() => {
            setContactToEdit(null);
            setShowAddModal(true);
          }}
          unreadCount={unreadCount}
          onOpenNotifications={() => setActiveTab('notifications')}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardPage
              setActiveTab={setActiveTab}
              onOpenAddModal={() => {
                setContactToEdit(null);
                setShowAddModal(true);
              }}
              onSelectContact={handleSelectContact}
            />
          )}

          {activeTab === 'contacts' && (
            <ContactsPage
              contacts={contacts}
              searchQuery={searchQuery}
              onOpenAddModal={() => {
                setContactToEdit(null);
                setShowAddModal(true);
              }}
              onSelectContact={handleSelectContact}
            />
          )}

          {activeTab === 'contact-details' && selectedContact && (
            <ContactDetailsPage
              contact={selectedContact}
              onBack={() => setActiveTab('contacts')}
              onEdit={handleOpenEdit}
              onDeleted={() => {
                loadInitialData();
                setActiveTab('contacts');
              }}
            />
          )}

          {activeTab === 'events' && (
            <EventsPage onSelectContact={handleSelectContact} />
          )}

          {activeTab === 'timeline' && (
            <TimelinePage onSelectContact={handleSelectContact} />
          )}

          {activeTab === 'map' && (
            <MapPage searchQuery={searchQuery} onSelectContact={handleSelectContact} />
          )}

          {activeTab === 'nearby' && (
            <NearbyContactsPage onSelectContact={handleSelectContact} />
          )}

          {activeTab === 'suggestions' && (
            <SmartSuggestionsPage onSelectContact={handleSelectContact} />
          )}

          {activeTab === 'graph' && (
            <RelationshipGraphPage onSelectContact={handleSelectContact} />
          )}

          {activeTab === 'analytics' && <AnalyticsPage />}

          {activeTab === 'notifications' && <NotificationsPage />}

          {activeTab === 'privacy' && <PrivacySettingsPage />}

          {activeTab === 'profile' && (
            <ProfilePage
              currentUser={currentUser}
              onUpdateProfile={(updated) => setCurrentUser(updated)}
            />
          )}

          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Add / Edit Contact Modal */}
      {showAddModal && (
        <ContactFormModal
          contactToEdit={contactToEdit}
          onClose={() => {
            setShowAddModal(false);
            setContactToEdit(null);
          }}
          onSaved={handleContactSaved}
        />
      )}
    </div>
  );
}

export default App;
