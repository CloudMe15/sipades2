/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { RTDashboard } from './components/rt/RTDashboard';
import { OperatorDashboard } from './components/operator/OperatorDashboard';
import { KecamatanDashboard } from './components/kecamatan/KecamatanDashboard';
import { LoginPage } from './components/auth/LoginPage';
import { RequestDetailModal } from './components/modals/RequestDetailModal';
import { LetterPreviewModal } from './components/modals/LetterPreviewModal';
import { PublicVerificationModal } from './components/modals/PublicVerificationModal';
import { WhatsAppGatewayModal } from './components/modals/WhatsAppGatewayModal';
import { ProfileModal } from './components/modals/ProfileModal';
import { AdminApprovalModal } from './components/modals/AdminApprovalModal';
import { ResetPasswordModal } from './components/modals/ResetPasswordModal';
import { SignedDocumentViewerModal } from './components/modals/SignedDocumentViewerModal';
import { ManageVillagesModal } from './components/modals/ManageVillagesModal';

const MainContent: React.FC = () => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return (
      <>
        <LoginPage />
        <RequestDetailModal />
        <LetterPreviewModal />
        <PublicVerificationModal />
        <WhatsAppGatewayModal />
        <ResetPasswordModal />
        <SignedDocumentViewerModal />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Application Header with Role Switcher & Live Clock */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {currentUser.role === 'rt' && <RTDashboard />}
        {currentUser.role === 'operator' && <OperatorDashboard />}
        {(currentUser.role === 'kecamatan' || currentUser.role === 'admin') && <KecamatanDashboard />}
      </main>

      {/* Global Modals */}
      <RequestDetailModal />
      <LetterPreviewModal />
      <PublicVerificationModal />
      <WhatsAppGatewayModal />
      <ProfileModal />
      <AdminApprovalModal />
      <ResetPasswordModal />
      <SignedDocumentViewerModal />
      <ManageVillagesModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
