import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../auth/AuthContext';

export default function AdminPanel() {
  const { currentUser, users, approveVip, revokeVip } = useAuth();

  if (currentUser?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const members = users.filter((user) => user.role !== 'admin');

  return (
    <div className="min-h-screen bg-[#f7f6f2] text-[#19110b] pt-28 px-6 pb-24">
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-[1100px] mx-auto mb-14"
      >
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#8a8278] mb-5">Administration</p>
        <h1 className="text-3xl md:text-5xl font-medium tracking-[0.18em]">Accès First Class</h1>
        <p className="font-editorial text-xl text-[#6f675f] mt-6 max-w-2xl leading-relaxed">
          Approuvez ou révoquez manuellement les invitations VIP. Seuls les comptes approuvés peuvent consulter FIRST CLASS.
        </p>
      </motion.header>

      <section className="max-w-[1100px] mx-auto bg-white">
        <div className="grid grid-cols-12 px-6 py-4 border-b border-[#e8e2da] text-[10px] uppercase tracking-[0.22em] text-[#8a8278]">
          <span className="col-span-4">Membre</span>
          <span className="col-span-3 hidden md:block">Email</span>
          <span className="col-span-3">Statut</span>
          <span className="col-span-5 md:col-span-2 text-right">Décision</span>
        </div>

        {members.length === 0 ? (
          <p className="p-10 text-center font-editorial text-xl text-[#8a8278]">Aucune demande enregistrée.</p>
        ) : (
          members.map((user) => (
            <div key={user.id} className="grid grid-cols-12 items-center px-6 py-5 border-b border-[#f0ece6]">
              <div className="col-span-4">
                <p className="text-sm tracking-[0.04em]">{user.name}</p>
                <p className="md:hidden text-xs text-[#8a8278] mt-1">{user.email}</p>
              </div>
              <p className="col-span-3 hidden md:block text-sm text-[#6f675f]">{user.email}</p>
              <p className="col-span-3 text-sm">
                {user.vip ? 'VIP approuvé' : 'Compte public'}
              </p>
              <div className="col-span-5 md:col-span-2 text-right">
                <button
                  onClick={() => (user.vip ? revokeVip(user.id) : approveVip(user.id))}
                  className="border border-[#19110b] px-4 py-2 text-[10px] uppercase tracking-[0.18em] hover:bg-[#19110b] hover:text-white transition-colors"
                >
                  {user.vip ? 'Révoquer' : 'Approuver'}
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}