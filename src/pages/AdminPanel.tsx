import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RefreshCw, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';

export default function AdminPanel() {
  const { currentUser, users, isLoadingUsers, refreshUsers, approveVip, revokeVip, deleteUser } = useAuth();

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      void refreshUsers();
    }
  }, [currentUser?.id]);

  if (currentUser?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const members = users.filter((user) => user.role !== 'admin');
  const vipCount = members.filter((user) => user.vip).length;
  const pendingCount = members.length - vipCount;

  return (
    <div className="min-h-screen bg-[#f7f6f2] text-[#19110b] pt-28 px-6 pb-24">
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-[1100px] mx-auto mb-14"
      >
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#8a8278] mb-5">belaironeadmin</p>
            <h1 className="text-3xl md:text-5xl font-medium tracking-[0.18em]">Comptes Supabase</h1>
            <p className="font-editorial text-xl text-[#6f675f] mt-6 max-w-2xl leading-relaxed">
              Gérez les comptes privés de la Maison, les accès VIP et les demandes First Class.
            </p>
          </div>

          <button
            onClick={() => void refreshUsers()}
            className="inline-flex items-center justify-center gap-3 border border-[#19110b] px-5 py-3 text-[10px] uppercase tracking-[0.22em] hover:bg-[#19110b] hover:text-white transition-colors"
          >
            <RefreshCw size={14} strokeWidth={1.4} className={isLoadingUsers ? 'animate-spin' : ''} />
            Actualiser
          </button>
        </div>
      </motion.header>

      <section className="mx-auto mb-8 grid max-w-[1100px] grid-cols-3 border-y border-[#dfd7cc] bg-[#fbfaf7]">
        <div className="px-5 py-6 text-center">
          <p className="text-3xl font-light">{members.length}</p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-[#8a8278]">Comptes</p>
        </div>
        <div className="border-x border-[#dfd7cc] px-5 py-6 text-center">
          <p className="text-3xl font-light">{vipCount}</p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-[#8a8278]">VIP</p>
        </div>
        <div className="px-5 py-6 text-center">
          <p className="text-3xl font-light">{pendingCount}</p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-[#8a8278]">Public</p>
        </div>
      </section>

      <section className="max-w-[1100px] mx-auto bg-white">
        <div className="grid grid-cols-12 px-6 py-4 border-b border-[#e8e2da] text-[10px] uppercase tracking-[0.22em] text-[#8a8278]">
          <span className="col-span-4">Membre</span>
          <span className="col-span-3 hidden md:block">Email</span>
          <span className="col-span-2">Statut</span>
          <span className="col-span-6 md:col-span-3 text-right">Décision</span>
        </div>

        {isLoadingUsers ? (
          <p className="p-10 text-center font-editorial text-xl text-[#8a8278]">Chargement des comptes Supabase.</p>
        ) : members.length === 0 ? (
          <p className="p-10 text-center font-editorial text-xl text-[#8a8278]">Aucune demande enregistrée.</p>
        ) : (
          members.map((user) => (
            <div key={user.id} className="grid grid-cols-12 items-center px-6 py-5 border-b border-[#f0ece6]">
              <div className="col-span-4">
                <p className="text-sm tracking-[0.04em]">{user.name}</p>
                <p className="md:hidden text-xs text-[#8a8278] mt-1">{user.email}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[#aaa39a]">
                  {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <p className="col-span-3 hidden md:block text-sm text-[#6f675f]">{user.email}</p>
              <p className="col-span-2 text-sm">
                {user.vip ? 'VIP approuvé' : 'Compte public'}
              </p>
              <div className="col-span-6 md:col-span-3 flex items-center justify-end gap-3">
                <button
                  onClick={() => void (user.vip ? revokeVip(user.id) : approveVip(user.id))}
                  className="border border-[#19110b] px-4 py-2 text-[10px] uppercase tracking-[0.18em] hover:bg-[#19110b] hover:text-white transition-colors"
                >
                  {user.vip ? 'Révoquer' : 'Approuver'}
                </button>
                <button
                  onClick={() => void deleteUser(user.id)}
                  className="p-2 text-[#8a8278] hover:text-[#19110b] transition-colors"
                  aria-label={`Supprimer ${user.name}`}
                >
                  <Trash2 size={16} strokeWidth={1.3} />
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
